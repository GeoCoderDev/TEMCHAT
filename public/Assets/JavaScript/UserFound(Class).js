import { ChatRequest } from "./ChatRequest(class).js";
import { MessageInMessagePanel } from "./MessageInMessagePanel(class).js";

export const CONT_USERS_FOUND = document.getElementById(
  "contenedor-usuarios-encontrados"
);

export class UserFound {
  /**
   *
   * @param {object} user_info
   * @param {string} user_info._id
   * @param {string} user_info.username
   * @param {*} mySocket
   */
  constructor(user_info, mySocket) {
    const usuarioEncontradoHTML = document.createElement("div");
    usuarioEncontradoHTML.id = `US-${user_info._id}`;
    usuarioEncontradoHTML.classList.add("cont-user-found");
    usuarioEncontradoHTML.innerHTML = `
            <span class="Username-user-found" title="${user_info.username}">${user_info.username}</span>
            <div class="Enviar-Solicitud-Button">Enviar Solicitud</div>
        `;

    CONT_USERS_FOUND.appendChild(usuarioEncontradoHTML);

    this.usuarioEncontradoHTML = usuarioEncontradoHTML;

    this.elementoHTML = usuarioEncontradoHTML;
    this.mySocket = mySocket;

    const requestButtonHMTL = document.querySelector(
      `#${usuarioEncontradoHTML.id} .Enviar-Solicitud-Button`
    );

    requestButtonHMTL.addEventListener("click", () => {
      if (requestButtonHMTL.classList.contains("solicitud-enviada-button"))
        return;

      if (
        MessageInMessagePanel.currentMessage?.currentOperationUserInformationID
      )
        return MessageInMessagePanel.resaltar(0.7);

      const enviarSolicitud = () => {
        if (ChatRequest.requestIDs.indexOf(user_info._id) !== -1) {
          return resaltWithBorder(
            ChatRequest.allRequests.get(user_info._id).componenteHTML,
            0.7, new Map([["filter","filter: saturate(2)"]])
          );
        }

        mySocket.emit("(SERVER)REQUEST-FOR-X-USER", user_info.username);

        const messageInPanel = new MessageInMessagePanel(
          `Enviando solicitud a ${user_info.username}`,
          undefined,
          true,
          JSON.stringify(user_info),
          true,
          "black",
          0.7
        );

        requestButtonHMTL.classList.add("solicitud-enviada-button");

        UserFound.userFoundRequestedCurrent = this;
      };

      if (MessageInMessagePanel.currentMessage) {
        MessageInMessagePanel.finish
          .then(() => {
            enviarSolicitud();
          })
          .catch((e) => {
            console.error(e);
          });

        return MessageInMessagePanel.currentMessage.finalizarMensaje();
      }

      enviarSolicitud();
    });
  }

  estadoInicial() {
    const requestButtonHMTL = document.querySelector(
      `#${this.usuarioEncontradoHTML.id} .Enviar-Solicitud-Button`
    );

    if (!requestButtonHMTL) return;

    requestButtonHMTL.classList.remove("solicitud-enviada-button");
  }
}
