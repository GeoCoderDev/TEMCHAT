import { ChatRequest } from "./ChatRequest(class).js";
import { Temchat } from "./Temchat(Class).js";
import { socket } from "./Chat-main.js";
import { MessageInMessagePanel } from "./MessageInMessagePanel(class).js";
import { ChatStateManager } from "./ChatStateManager(Singleton class).js";

const MANAGER = new ChatStateManager();

const RANDOM_TEMCHAT_TIME_INPUT = document.getElementById(
  "random-temchat-time"
);

const PERSISTENT_RANDOM_TEMCHAT_TIME_INPUT = document.getElementById(
  "random-temchat-persistent-time"
);

const BOTON_SWITCH_MODO_IMAN = document.getElementById("btn-switch");

const BOTON_CHAT_ALEATORIO_MAGNETICO = document.getElementById(
  "random-temchat-magnetic-button"
);

const CONT_MODO_IMAN = document.getElementById("cont-modo-iman");

//Evento para que no se pase del minimo o maximo y respete un numero como entrada
delegarEvento("change", `#random-chat input[type="number"]`, (e) => {
  if (parseInt(e.target.value) !== parseInt(e.target.value))
    e.target.value = e.target.defaultValue;

  if (parseInt(e.target.value) > parseInt(e.target.max))
    e.target.value = e.target.max;

  if (parseInt(e.target.value) < parseInt(e.target.min))
    e.target.value = e.target.min;
});

socket.emit("MY-USERNAME", myUsername);

// EN CASO RECIBAS UNA SOLICITUD
socket.on(
  "TEMCHAT-REQUEST-FOR-YOU",
  (requesterUserData, type, waitTimeRequest) => {
    const REQUESTER_DATA = JSON.parse(requesterUserData);

    const MI_USER_DATA = JSON.parse(sessionStorage.getItem("USER-DATA"));

    const waitTime = parseFloat(waitTimeRequest);

    if (ChatRequest.allRequests.has(REQUESTER_DATA._id)) return;
    const chatRequest = new ChatRequest(REQUESTER_DATA, waitTime);

    socket.emit("(SERVER)REQUEST-RECEIVED", JSON.stringify(MI_USER_DATA));

    if (MANAGER.ESTADO_ACTUAL == 2) {
      // ACEPTAR SI O SI
      // socket.to(REQUESTER_DATA.socketConectionID).emit('TEMCHAT',()=>{
      //     socket.emit('CHANGE-STATE',0);
      // })
    }

    chatRequest.Promise
      // EN CASO ACEPTES LA SOLICITUD
      .then(() => {
        MANAGER.ESTADO_ACTUAL = 0;
        socket.emit(
          "(SERVER)TEMCHAT-ACCEPTED-FOR-YOU",
          REQUESTER_DATA.username
        );
        MANAGER.TEMCHAT_ACTUAL = new Temchat(
          MI_USER_DATA,
          REQUESTER_DATA,
          socket
        );

        // LA UNICA FORMA QUE TEMCHAT FINALICE POR finished, ES PORQUE
        // YO MISMO LOS DECIDI
        MANAGER.TEMCHAT_ACTUAL.finishedByMe.then(() => {
          socket.emit(
            "(SERVER)TEMCHAT-FINISHED-FOR-YOU",
            REQUESTER_DATA.username
          );
          MANAGER.ESTADO_ACTUAL = 1;
          MANAGER.TEMCHAT_ACTUAL = undefined;
        });
      })
      .catch(() => {
        //EN CASO RECHACES LA SOLICITUD
        socket.emit(
          "(SERVER)TEMCHAT-REJECTED-FOR-YOU",
          REQUESTER_DATA.username
        );
      });
  }
);

socket.on("TEMCHAT-REJECTED-FOR-YOU", (userInfo) => {
  const USER_INFO = JSON.parse(userInfo);
  MessageInMessagePanel.cancelarMensajeActual("Rejected-for-me", USER_INFO._id);
});

socket.on("CANCEL-REQUEST-FROM-X-USER", (userInfo) => {
  const USER_DATA_INFO = JSON.parse(userInfo);
  ChatRequest.allRequests.get(USER_DATA_INFO._id)?.eliminarPorCancelacion();
});

// SOCKET PARA ENVIAR UNA SOLICITUD A USUARIO ALEATORIO
delegarEvento("click", "#random-temchat-button", (e) => {
  if (MessageInMessagePanel.testearMensajeActualConResaltado()) return;

  const iniciarSolicitudRandom = () => {
    e.target.setAttribute("disabled", true);
    RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);

    socket.emit("GET-ALEATORY-USER", JSON.stringify(ChatRequest.requestIDs));

    let requestEventID;

    requestEventID = MANAGER.NuevoChatRequest.addEventListener(
      (messageInPanel) => {
        messageInPanel.finish.then(() => {
          MANAGER.NuevoChatRequest.removeEventListener(requestEventID);
          if (
            MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO &&
            e.target.hasAttribute("disabled") &&
            RANDOM_TEMCHAT_TIME_INPUT.hasAttribute("disabled")
          )
            return;

          e.target.removeAttribute("disabled");
          RANDOM_TEMCHAT_TIME_INPUT.removeAttribute("disabled");
        });
      }
    );
  };

  if (MessageInMessagePanel.currentMessage) {
    if (MessageInMessagePanel.currentMessage.type === "UsNF") return;

    MessageInMessagePanel.currentMessage.forceFinish(4);

    e.target.setAttribute("disabled", true);

    return MessageInMessagePanel.currentMessage.finish.then(() => {
      socket.emit("GET-ALEATORY-USER", JSON.stringify(ChatRequest.requestIDs));
      iniciarSolicitudRandom();
    });
  }

  iniciarSolicitudRandom();
});

/**
 *
 * @param {HTMLElement} botonExcepcion
 * @returns {Function} esta funcion devuelve otra funcion que te permite activar otra vez los botones
 */
const desactivarLosOtrosBotones = (botonExcepcion) => {
  const elementos = document.querySelectorAll(".botones-chat-random");

  elementos.forEach((el) =>
    el !== botonExcepcion ? el.setAttribute("disabled", true) : undefined
  );

  return () =>
    elementos.forEach((el) => {
      el !== botonExcepcion ? el.removeAttribute("disabled") : undefined;
    });
};

let activacionDeBotones;
let eventIdActual;

const BOTON_CHAT_RANDOM_PERSISTENTE = document.getElementById(
  "random-temchat-persistente-button"
);

const desactivarPersistenciaChatRandom = () => {
  BOTON_CHAT_RANDOM_PERSISTENTE.innerText = "CHAT ALEATORIO PERSISTENTE";
  MessageInMessagePanel.cancelarMensajeActual("Reject-any-way");

  activacionDeBotones?.();
  RANDOM_TEMCHAT_TIME_INPUT.removeAttribute("disabled");
  CONT_MODO_IMAN.removeAttribute("disabled");
  BOTON_SWITCH_MODO_IMAN.removeAttribute("disabled");

  if (eventIdActual)
    MANAGER.NuevoChatRequest.removeEventListener(eventIdActual);

  MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO = false;
};

delegarEvento("click", BOTON_CHAT_RANDOM_PERSISTENTE, (e) => {
  if (MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO)
    return desactivarPersistenciaChatRandom();

  //En caso iniciemos el Chat Aleatorio Persistente
  if (MessageInMessagePanel.testearMensajeActualConResaltado()) return;

  MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO = true;

  const solicitudesRandomRecursivas = () => {
    if (!MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO) return;
    if (eventIdActual)
      MANAGER.NuevoChatRequest.removeEventListener(eventIdActual);

    socket.emit("GET-ALEATORY-USER", JSON.stringify(ChatRequest.requestIDs));

    eventIdActual = MANAGER.NuevoChatRequest.addEventListener(
      (messageInPanel) => {
        if (!MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO) {
          return messageInPanel.forceFinish(2);
        }
        messageInPanel.finish.then(() => solicitudesRandomRecursivas());
      }
    );
  };

  const empezarSolicitudes = () => {
    e.target.innerText = "DESACTIVAR CHAT ALEATORIO PERSISTENTE";
    activacionDeBotones = desactivarLosOtrosBotones(e.target);
    RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);
    CONT_MODO_IMAN.setAttribute("disabled", true);
    BOTON_SWITCH_MODO_IMAN.setAttribute("disabled", true);
    solicitudesRandomRecursivas();
  };

  if (
    !MessageInMessagePanel.cancelarMensajeActual(
      "Reject-any-way",
      empezarSolicitudes
    )
  )
    empezarSolicitudes();
});

socket.on("TAKE-YOUR-ALEATORY-USER", (aleatoryUser) => {
  let messageInPanel;

  if (!aleatoryUser) {
    messageInPanel = new MessageInMessagePanel(
      `No se encontraron Usuarios\u{1F641}`,
      3,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      "UsNF"
    );
  } else {
    const aleatoryUserObject = JSON.parse(aleatoryUser);
    const duracionRequest = MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO
      ? parseInt(PERSISTENT_RANDOM_TEMCHAT_TIME_INPUT.value)
      : parseInt(RANDOM_TEMCHAT_TIME_INPUT.value);

    socket.emit(
      "(SERVER)REQUEST-FOR-X-USER",
      aleatoryUserObject.username,
      "RANDOM-TEMCHAT",
      duracionRequest
    );

    messageInPanel = new MessageInMessagePanel(
      `Enviando solicitud a ${aleatoryUserObject.username}`,
      duracionRequest,
      true,
      aleatoryUser,
      true,
      "black",
      0.7,
      true
    );
  }

  MANAGER.NuevoChatRequest.dispatchEvent(messageInPanel);
});

socket.on("TAKE-YOUR-MAGNETIC-USER", (aleatoryMagneticUser) => {
  let messageInPanel;

  if (!aleatoryMagneticUser) {
    messageInPanel = new MessageInMessagePanel(
      "No se encontraron usuarios con el modo iman activado\u{1F641}",
      0.7,undefined,undefined,undefined,undefined,undefined,undefined,"UsNF"
    );
  } else {
    const MAGNETIC_ALEATORY_USER = JSON.parse(aleatoryMagneticUser);
    messageInPanel = new MessageInMessagePanel(
      `${MAGNETIC_ALEATORY_USER.username} te ha atraído`,
      0.7,
      false,
      aleatoryMagneticUser
    );
  }

  MANAGER.NuevoChatRequest.dispatchEvent(messageInPanel);
});

//MODO IMAN
BOTON_SWITCH_MODO_IMAN.addEventListener("change", (e) => {
  if (!e.target.checked) {
    if (!MANAGER.TEMCHAT_ACTUAL) MANAGER.ESTADO_ACTUAL = 1;

    activacionDeBotones?.();
    RANDOM_TEMCHAT_TIME_INPUT.removeAttribute("disabled");
    PERSISTENT_RANDOM_TEMCHAT_TIME_INPUT.removeAttribute("disabled");

    return;
  }

  if (MessageInMessagePanel.testearMensajeActualConResaltado())
    return (e.target.checked = false);

  if (
    !MessageInMessagePanel.cancelarMensajeActual(
      "Finalize-message-UsNF",
      () => {
        MANAGER.ESTADO_ACTUAL = 2;
        activacionDeBotones = desactivarLosOtrosBotones();
        RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);
        PERSISTENT_RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);
      }
    )
  ) {
    MANAGER.ESTADO_ACTUAL = 2;
    activacionDeBotones = desactivarLosOtrosBotones();
    RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);
    PERSISTENT_RANDOM_TEMCHAT_TIME_INPUT.setAttribute("disabled", true);
  }
});

delegarEvento("click", BOTON_CHAT_ALEATORIO_MAGNETICO, (e) => {
  if (MessageInMessagePanel.testearMensajeActualConResaltado()) return;

  let eventId;

  const iniciarSolicituMagnetica = () => {
    CONT_MODO_IMAN.setAttribute("disabled", true);
    BOTON_SWITCH_MODO_IMAN.setAttribute("disabled", true);
    e.target.setAttribute("disabled", true);

    socket.emit("GET-ALEATORY-MAGNETIC-USER");

    MANAGER.CHAT_REQUEST_MAGNETIC = true;
  };

  const terminarSolicitudMagnetica = () => {
    CONT_MODO_IMAN.removeAttribute("disabled");
    BOTON_SWITCH_MODO_IMAN.removeAttribute("disabled");
    e.target.removeAttribute("disabled");

    if (eventId) MANAGER.NuevoChatRequest.removeEventListener(eventId);
    MANAGER.CHAT_REQUEST_MAGNETIC = false;

    MANAGER.TEMCHAT_ACTUAL = undefined;
    MANAGER.ESTADO_ACTUAL = 1;
  };

  let eventIdTemchatFinish;

  eventIdTemchatFinish = MANAGER.TemchatFinish.addEventListener(() => {
    terminarSolicitudMagnetica();
    if (eventIdTemchatFinish)
      MANAGER.TemchatFinish.removeEventListener(eventIdTemchatFinish);
  });

  if (
    !MessageInMessagePanel.cancelarMensajeActual(
      "Finalize-message-UsNF",
      iniciarSolicituMagnetica
    )
  )
    iniciarSolicituMagnetica();

  eventId = MANAGER.NuevoChatRequest.addEventListener((messageInPanel) => {
    messageInPanel.finish.then(() => {

      if(messageInPanel.type==="UsNF") return terminarSolicitudMagnetica();

      const MI_USER_DATA = JSON.parse(sessionStorage.getItem("USER-DATA"));

      MANAGER.TEMCHAT_ACTUAL = new Temchat(
        MI_USER_DATA,
        messageInPanel.currentOperationUserInformation,
        socket
      );
      MANAGER.ESTADO_ACTUAL = 0;

      // LA UNICA FORMA QUE TEMCHAT FINALICE POR finished, ES PORQUE
      // YO MISMO LOS DECIDI
      MANAGER.TEMCHAT_ACTUAL.finishedByMe.then(() => {
        socket.emit(
          "(SERVER)TEMCHAT-FINISHED-FOR-YOU",
          messageInPanel.currentOperationUserInformation.username
        );
        terminarSolicitudMagnetica();
      });
    });
  });
});

socket.on("TEMCHAT-REQUEST-ACCEPTED-FOR-YOU", (miUserData, otherUserData) => {
  const MY_DATA_USER = JSON.parse(miUserData);
  const OTHER_DATA_USER = JSON.parse(otherUserData);

  if (MANAGER.PERSISTENCIA_CHAT_RANDOM_ACTIVADO)
    desactivarPersistenciaChatRandom();

  MessageInMessagePanel.cancelarMensajeActual("Accept-for-me");

  const iniciarTemchatObligatoriamente = () => {
    MANAGER.TEMCHAT_ACTUAL = new Temchat(MY_DATA_USER, OTHER_DATA_USER, socket);
    MANAGER.ESTADO_ACTUAL = 0;
    // LA UNICA FORMA QUE TEMCHAT FINALICE POR finished, ES PORQUE
    // YO MISMO LOS DECIDI
    MANAGER.TEMCHAT_ACTUAL.finishedByMe.then(() => {
      socket.emit("(SERVER)TEMCHAT-FINISHED-FOR-YOU", OTHER_DATA_USER.username);
      MANAGER.TEMCHAT_ACTUAL = undefined;
      MANAGER.ESTADO_ACTUAL = 1;
    });
  };

  if (BOTON_SWITCH_MODO_IMAN.checked) {
    const avisoEnPanel = new MessageInMessagePanel(
      `${OTHER_DATA_USER.username} ha sido atraido`,
      0.7
    );
    avisoEnPanel.finish.then(() => {
      iniciarTemchatObligatoriamente();

      setTimeout(() => {
        BOTON_SWITCH_MODO_IMAN.checked = false;
        BOTON_SWITCH_MODO_IMAN.dispatchEvent(new Event("change"));
      }, 2000);
    });
  } else {
    iniciarTemchatObligatoriamente();
  }
});

//SI LA OTRA PERSONA FINALIZO EL TEMCHAT
socket.on("TEMCHAT-FINISHED-FOR-YOU", () => {
  MANAGER.TEMCHAT_ACTUAL?.finalizarChat?.(false);
  MANAGER.TEMCHAT_ACTUAL = undefined;
  MANAGER.ESTADO_ACTUAL = 1;
  MANAGER.TemchatFinish.dispatchEvent();
});
