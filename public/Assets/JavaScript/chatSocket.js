import { ChatRequest } from "./ChatRequest(class).js";
import { Temchat } from "./Temchat(Class).js";
import { socket } from "./Chat-main.js";
import { MessageInMessagePanel } from "./MessageInMessagePanel(class).js";
import { UserFound } from "./UserFound(Class).js";

let ESTADO_ACTUAL = 1;

const RANDOM_TEMCHAT_TIME_INPUT = document.getElementById(
  "random-temchat-time"
);

RANDOM_TEMCHAT_TIME_INPUT.addEventListener("change",()=>{
  if(parseInt(RANDOM_TEMCHAT_TIME_INPUT.value)>parseInt(RANDOM_TEMCHAT_TIME_INPUT.max)) RANDOM_TEMCHAT_TIME_INPUT.value = RANDOM_TEMCHAT_TIME_INPUT.max;

  if(parseInt(RANDOM_TEMCHAT_TIME_INPUT.value)<parseInt(RANDOM_TEMCHAT_TIME_INPUT.min)) RANDOM_TEMCHAT_TIME_INPUT.value = RANDOM_TEMCHAT_TIME_INPUT.min;
})

socket.emit("MY-USERNAME", myUsername);

// EN CASO RECIBAS UNA SOLICITUD
socket.on(
  "TEMCHAT-REQUEST-FOR-YOU",
  (requesterUserData, type, waitTimeRequest) => {
    const MI_USER_DATA = JSON.parse(sessionStorage.getItem("USER-DATA"));
    const REQUESTER_DATA = JSON.parse(requesterUserData);
    const waitTime = parseFloat(waitTimeRequest);
    const chatRequest = new ChatRequest(REQUESTER_DATA, waitTime);

    socket.emit("REQUEST-RECEIVED", JSON.stringify(MI_USER_DATA));

    if (ESTADO_ACTUAL == 2) {
      // ACEPTAR SI O SI
      // socket.to(REQUESTER_DATA.socketConectionID).emit('TEMCHAT',()=>{
      //     socket.emit('CHANGE-STATE',0);
      // })
    }

    chatRequest.Promise
      // EN CASO ACEPTES LA SOLICITUD
      .then(() => {
        socket.emit("CHANGE-STATE", 0);
        socket.emit(
          "(SERVER)TEMCHAT-ACCEPTED-FOR-YOU",
          JSON.stringify(REQUESTER_DATA)
        );
        const TEMCHAT_ACTUAL = new Temchat(
          MI_USER_DATA,
          REQUESTER_DATA,
          socket
        );

        // LA UNICA FORMA QUE TEMCHAT FINALICE POR finished, ES PORQUE
        // YO MISMO LOS DECIDI
        TEMCHAT_ACTUAL.finishedForMe.then(() => {
          socket.emit("(SERVER)TEMCHAT-FINISHED-FOR-YOU", requesterUserData);
          socket.emit("CHANGE-STATE", 1);
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

  if (
    USER_INFO._id ==
    MessageInMessagePanel.currentMessage?.currentOperationUserInformationID
  ) {
    MessageInMessagePanel.currentMessage.forceFinish(0);
  }
});

socket.on("CANCEL-REQUEST-FROM-X-USER", (userInfo) => {
  const USER_DATA_INFO = JSON.parse(userInfo);
  ChatRequest.allRequests.get(USER_DATA_INFO._id).desvanecerElemento();
});

// SOCKET PARA ENVIAR UNA SOLICITUD A CUALQUIER USUARIO
delegarEvento("click", "#random-temchat-button", (e) => {
  socket.emit("GET-ALEATORY-USER");
  // socket.emit("TEMCHAT-REQUEST-FOR-ALEATORY-USER");
});

socket.on("TAKE-YOUR-ALEATORY-USER", (aleatoryUser) => {
  if (MessageInMessagePanel.currentMessage?.currentOperationUserInformationID)
    return MessageInMessagePanel.resaltar(0.7);

  console.log(aleatoryUser)  
  const aleatoryUserObject = JSON.parse(aleatoryUser);

  socket.emit(
    "(SERVER)REQUEST-FOR-X-USER",
    aleatoryUserObject.username,"RANDOM-TEMCHAT",
    RANDOM_TEMCHAT_TIME_INPUT.value
  );

  const messageInPanel = new MessageInMessagePanel(
    `Enviando solicitud a ${aleatoryUserObject.username}`,
    undefined,
    true,
    aleatoryUser,
    true,
    "black",
    0.7
  );


});

socket.on("TEMCHAT-REQUEST-ACCEPTED-FOR-YOU", (miUserData, otherUserData) => {
  const MY_DATA_USER = JSON.parse(miUserData);
  const OTHER_DATA_USER = JSON.parse(otherUserData);

  if (MessageInMessagePanel.currentMessage) {
    MessageInMessagePanel.currentMessage.forceFinish(1);
  }

  const TEMCHAT_ACTUAL = new Temchat(MY_DATA_USER, OTHER_DATA_USER, socket);

  // LA UNICA FORMA QUE TEMCHAT FINALICE POR finished, ES PORQUE
  // YO MISMO LOS DECIDI
  TEMCHAT_ACTUAL.finishedForMe.then(() => {
    socket.emit("(SERVER)TEMCHAT-FINISHED-FOR-YOU", otherUserData);
    socket.emit("CHANGE-STATE", 1);
  });

  //SI LA OTRA PERSONA FINALIZO EL TEMCHAT
  socket.on("TEMCHAT-FINISHED-FOR-YOU", () => {
    TEMCHAT_ACTUAL.finalizarChat(false);
    socket.emit("CHANGE-STATE", 1);
  });
});

window.addEventListener("beforeunload", () => {
  socket.emit("hola");
});
