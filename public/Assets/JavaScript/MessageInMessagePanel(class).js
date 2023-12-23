import { CountdownTimer } from "./CountdownTimer(class).js";
import { socket } from "./Chat-main.js";
import { UserFound } from "./UserFound(Class).js";

const MESSAGE_PANEL = document.getElementById("messages-panel");

export class MessageInMessagePanel {
  /**
   *
   * @param {string} message
   * @param {number} duration en segundos
   * @param {boolean} cancelButton
   * @param {String} currentOperationUserInformation debe estar en formato String(JSON)
   * @param {String} dotsColor
   * @param {Number} dotAnimationDuration en segundos
   */
  constructor(
    message,
    duration,
    cancelButton = false,
    currentOperationUserInformation = undefined,
    threeDotsAnimation = false,
    dotsColor = "black",
    dotAnimationDuration = 0.3
  ) {
    const mensajeHTML = document.createElement("div");
    mensajeHTML.classList.add("mesagge-in-panel");
    mensajeHTML.style.display = "none";
    mensajeHTML.innerText = message;

    let dotsAnimationStart;
    let dotsAnimationID;

    if (threeDotsAnimation) {
      mensajeHTML.insertAdjacentHTML(
        "beforeend",
        `<span class="dot-for-animation-in-message">.</span><span class="dot-for-animation-in-message">.</span><span class="dot-for-animation-in-message">.</span>`
      );

      dotsAnimationStart = () => {
        const puntos = document.querySelectorAll(".dot-for-animation-in-message");

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
                { color: dotsColor }
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
        } 

        dostsAnimation();

        return setInterval(dostsAnimation, dotAnimationDuration * 1000 * 3);
      };
    }

    MessageInMessagePanel.currentMessage = this;

    if (currentOperationUserInformation) {
      this.currentOperationUserInformationID = JSON.parse(
        currentOperationUserInformation
      )._id;
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
     * @param {0 | 1} state 0 para cuando se ha rechazado y 1 para cuando se acepto la solicitud
     */
    const finalizarMensaje = (state = undefined) => {
      desvanecerElemento(
        document.querySelector(`#${MESSAGE_PANEL.id} .mesagge-in-panel`),
        0.35,
        false,
        1,
        "linear",
        true,
        MESSAGE_PANEL
      ).animacionFinalizada.then(() => {
        resolveFinish();
        UserFound.userFoundRequestedCurrent.estadoInicial();
        MessageInMessagePanel.currentMessage = undefined;
        document
          .querySelector(`#${MESSAGE_PANEL.id} .mesagge-in-panel`)
          .remove();
      });

      if(dotsAnimationID) clearInterval(dotsAnimationID);

      if (!currentOperationUserInformation || state) return;
      socket.emit(
        "(SERVER)CANCEL-REQUEST-FOR-X-USER",
        currentOperationUserInformation
      );
    };

    // Este metodo se usara para cuando se necesite cancelar
    // una solicitud sin que el usuario haga click en cancelar
    this.forceFinish = finalizarMensaje;

    if (!duration) {
      // SI NO HAY DURACION
      MESSAGE_PANEL.appendChild(mensajeHTML);

      aparecerElemento(
        mensajeHTML,
        0.35,
        "100%",
        "block",
        true
      ).animacionFinalizada.then(() => {

        if(dotsAnimationStart){
          dotsAnimationID = dotsAnimationStart();
        }

        if (cancelButtonHTML) {
          cancelButtonHTML.addEventListener("click", () => {
            UserFound.userFoundRequestedCurrent.estadoInicial();
            finalizarMensaje();
          });
        }


      });

      return;
    }

    // EN CASO SI HAYA DURACION

    const cronometro = new CountdownTimer(duration, 1, false);

    MESSAGE_PANEL.appendChild(mensajeHTML);

    aparecerElemento(mensajeHTML, 0.35, "100%", "block", true)
      .animacionFinalizada.then(() => {

        if(dotsAnimationStart){
          dotsAnimationID = dotsAnimationStart();
        }

        if (cancelButtonHTML) {
          cancelButtonHTML.addEventListener("click", () => {
            cronometro.forceFinish();
          });
        }

        return cronometro.start();
      })
      .then(() => {
        finalizarMensaje();
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

/**
 *
 * @param {Number} duration en segundos
 */

MessageInMessagePanel.resaltar = (duration) => {
  MESSAGE_PANEL.animate(
    [
      { filter: "brightness(0.8)" },
      { filter: "brightness(0.8)" },
      { filter: "brightness(0.8)" },
      { filter: "none" },
      { filter: "none" },
    ],
    {
      easing: "ease-in",
      duration: duration * 1000,
      iterations: 1,
      fill: "forwards",
    }
  );
};
