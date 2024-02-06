import { CountdownTimer } from "./CountdownTimer(class).js";
import { socket } from "./Chat-main.js";
import { UserFound } from "./UserFound(Class).js";

const MESSAGE_PANEL = document.getElementById("messages-panel");

export class MessageInMessagePanel {
  static currentMessage;

  animacion;
  seFinalizoElMensaje = false;
  /**
   *
   * @param {string} message
   * @param {number} duration en segundos
   * @param {boolean} cancelButton
   * @param {String} currentOperationUserInformation debe estar en formato String(JSON)
   * @param {String} dotsColor
   * @param {number} dotAnimationDuration en segundos
   * @param {boolean} mostrarDuracion
   * @param {'unknow' | 'UsNF'} type
   */
  constructor(
    message,
    duration,
    cancelButton = false,
    currentOperationUserInformation = undefined,
    threeDotsAnimation = false,
    dotsColor = "black",
    dotAnimationDuration = 0.3,
    mostrarDuracion = false,
    type = "unknow"
  ) {
    MessageInMessagePanel.currentMessage = this;
    const mensajeHTML = document.createElement("div");
    mensajeHTML.classList.add("mesagge-in-panel");
    mensajeHTML.style.position = "absolute";
    mensajeHTML.style.opacity = 0;
    mensajeHTML.insertAdjacentText("afterbegin", message);

    this.type = type;

    let dotsAnimationStart;
    let dotsAnimationID;

    if (threeDotsAnimation) {
      mensajeHTML.insertAdjacentHTML(
        "beforeend",
        `<span class="dot-for-animation-in-message">.</span><span class="dot-for-animation-in-message">.</span><span class="dot-for-animation-in-message">.</span>`
      );

      dotsAnimationStart = () => {
        const puntos = document.querySelectorAll(
          ".dot-for-animation-in-message"
        );

        const dostsAnimation = () => {
          puntos.forEach((punto, index) => {
            punto.animate(
              [
                { color: "transparent" },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
                { color: dotsColor },
              ],
              {
                delay: dotAnimationDuration * index * 1000,
                fill: "none",
                iterations: 1,
                duration: dotAnimationDuration * 1000 * (3 - index),
                easing: "linear",
              }
            );
          });
        };

        dostsAnimation();

        return setInterval(dostsAnimation, dotAnimationDuration * 1000 * 3);
      };
    }

    if (currentOperationUserInformation) {
      const currentOperationUserInformationObject = JSON.parse(
        currentOperationUserInformation
      );

      this.currentOperationUserInformation =
        currentOperationUserInformationObject;

      this.currentOperationUserInformationID =
        currentOperationUserInformationObject._id;

      this.currentOperationUserInformationUsername =
        currentOperationUserInformationObject.username;
    }

    let cancelButtonHTML;

    if (cancelButton) {
      cancelButtonHTML = document.createElement("button");
      cancelButtonHTML.innerHTML = "Cancelar";
      cancelButtonHTML.classList.add("cancel-request-button");
      mensajeHTML.insertAdjacentElement("beforeend", cancelButtonHTML);
    }

    let resolveFinish;

    this.finish = new Promise((resolve, reject) => {
      resolveFinish = resolve;
    });

    /**
     *
     * @param { 0 | 1 | 2 | 3 | 4} state 0 para cuando te ha rechazado, 1 para cuando te acepto la solicitud, 2 para cuando rechazas tu, 3 para cuando se acaba el tiempo y 4 para cuando quieres rechazar o finalizar un mensaje sin causar nada
     */
    const finalizarMensaje = (state = undefined) => {
      if (this.seFinalizoElMensaje) return;

      if (dotsAnimationID) clearInterval(dotsAnimationID);

      this.seFinalizoElMensaje = true;

      const finalizarDefinitivamente = () => {
        resolveFinish();
        UserFound.userFoundRequestedCurrent?.estadoInicial();
        MessageInMessagePanel.currentMessage = undefined;
        document
          .querySelector(`#${MESSAGE_PANEL.id} .mesagge-in-panel`)
          .remove();
        mensajeHTML.innerHTML = "";
      };

      if (state == 2)
        socket.emit(
          "(SERVER)CANCEL-REQUEST-FOR-X-USER",
          this.currentOperationUserInformationUsername
        );

      if (state != 3 && this.cronometro) {
        if (this.cronometro.forceFinish) {
          this.cronometro.forceFinish();
        } else {
          finalizarDefinitivamente();
          return this.finish;
        }
      }

      // Reanudando para desaparecer
      this.animacion.iniciar();

      this.animacion.finished.then(() => {
        if (state === 0) {
          return this.desplegarPostMensaje(
            `${this.currentOperationUserInformationUsername} rechazo tu solicitud`
          ).then(() => finalizarDefinitivamente());
        }

        finalizarDefinitivamente();
      });

      return this.finish;
    };

    // Este metodo se usara para cuando se necesite cancelar
    // una solicitud sin que el usuario haga click en cancelar
    this.forceFinish = finalizarMensaje;

    MESSAGE_PANEL.appendChild(mensajeHTML);

    this.animacion = new AnimacionAparicionYDesaparicion(mensajeHTML, 0.3, [
      "mesagge-in-panel",
    ]);

    if (!duration) {
      // SI NO HAY DURACION

      this.animacion.iniciar();
      this.animacion.aparicionFinalizada.then(() => {
        if (dotsAnimationStart) {
          dotsAnimationID = dotsAnimationStart();
        }

        if (cancelButtonHTML) {
          cancelButtonHTML.addEventListener("click", (e) => {
            // if(!UserFound.userFoundRequestedCurrent) return;
            e.target.setAttribute("disabled", true);
            finalizarMensaje(2);
          });
        }
      });

      return;
    }

    // EN CASO SI HAYA DURACION
    if (mostrarDuracion) {
      const span = document.createElement("span");
      span.innerText = duration;
      span.classList.add("numeros-duracion-mensaje-en-panel");
      mensajeHTML.insertAdjacentElement("afterbegin", span);
      this.cronometro = new CountdownTimer(duration, 1, true, 0, span);
    } else {
      this.cronometro = new CountdownTimer(duration, 1, false);
    }

    MESSAGE_PANEL.appendChild(mensajeHTML);

    this.animacion.iniciar();
    this.animacion.aparicionFinalizada
      .then(() => {
        if (dotsAnimationStart) {
          dotsAnimationID = dotsAnimationStart();
        }

        if (cancelButtonHTML) {
          cancelButtonHTML.addEventListener("click", (e) => {
            e.target.setAttribute("disabled", true);
            finalizarMensaje(2);
          });
        }

        return this.cronometro.start();
      })
      .then(() => {
        finalizarMensaje(3);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  desplegarPostMensaje(mensaje = "", duration = 1) {
    if (!this.currentOperationUserInformationID) return;
    const postMessageInPanel = new MessageInMessagePanel(
      mensaje,
      duration,
      false
    );

    return postMessageInPanel.finish;
  }

  /**
   *
   * @param {Number} duration en segundos
   */
  static resaltar(duration) {
    return resaltWithBorder(MESSAGE_PANEL, duration);
  }

  /**
   * @returns {boolean} devuelve true si hay un mensaje con usuario en el panel o false de lo contrario
   */
  static testearMensajeActualConResaltado() {
    if (
      MessageInMessagePanel.currentMessage?.currentOperationUserInformationID
    ) {
      MessageInMessagePanel.resaltar(0.7);
      return true;
    }
    return false;
  }

  static casesForFinishCurrentMessage = {
    "Rejected-for-me": (userID) => {
      if (
        MessageInMessagePanel.currentMessage
          .currentOperationUserInformationID === userID
      ) {
        MessageInMessagePanel.currentMessage.forceFinish(0);
        return true;
      }
      return false;
    },
    "Accept-for-me": () => {
      MessageInMessagePanel.currentMessage.forceFinish(1);
      return true;
    },

    /**
     *
     * @param {()=>void} callback
     * @returns
     */
    "Reject-any-way": (callback) => {
      if (
        MessageInMessagePanel.currentMessage?.currentOperationUserInformationID
      ) {
        MessageInMessagePanel.currentMessage.forceFinish(2).then(() => {
          callback?.();
        });
      } else if (MessageInMessagePanel.currentMessage) {
        MessageInMessagePanel.currentMessage
          .forceFinish(4)
          .then(() => callback?.());
      }
      return true;
    },
    /**
     *
     * @param {()=>void} callback
     * @returns
     */
    "Finalize-message-UsNF": (callback) => {
      if (!(MessageInMessagePanel.currentMessage.type === "UsNF")) return false;
      MessageInMessagePanel.currentMessage
        .forceFinish(4)
        .then(() => callback?.());
      return true;
    },
    "Finalize-message-any-type": (callback) => {
      MessageInMessagePanel.currentMessage
        .forceFinish(4)
        .then(() => callback?.());
      return true;
    },
  };

  /**
   * @param {keyof MessageInMessagePanel.casesForFinishCurrentMessage} casoUso
   * @param {any} aditionalArguments
   * @param {boolean} forzar especifica si se debe forzar la terminacion del mensaje si o si, false por defecto
   * @returns {boolean} devuelve true si es que se logro cancelar con exito y false si es que no se pudo cancelar con exito o si no habia un mensaje actual
   */
  static cancelarMensajeActual(casoUso, aditionalArguments, forzar = false) {
    if (!MessageInMessagePanel.currentMessage) return false;

    return MessageInMessagePanel.casesForFinishCurrentMessage[casoUso](
      aditionalArguments
    );
  }
}
