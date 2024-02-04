import { CountdownTimer } from "./CountdownTimer(class).js";
import { abrirPuertas, cerrarPuertas } from "./Chat-main.js";

const CONTENEDOR_DE_CHAT_EN_VIVO = document.getElementById("cont-live-chat");
const COUNT_DOWN_TIMER = document.getElementById("Count-Down-Timer");
const DELAY_FOR_COUNTDOWNTIMER = 0.5;

export class Temchat {
  animation;

  /**
   *
   * @param {object} miUserData
   * @param {object} otherUserData
   * @param {object} miSocket
   */
  constructor(miUserData, otherUserData, miSocket) {
    this.miUserData = miUserData;
    this.otherUserData = otherUserData;
    this.miSocket = miSocket;
    console.log(otherUserData);
    const componenteHTML = document.createElement("div");
    componenteHTML.classList.add("TEMCHAT");
    componenteHTML.id = `T-${this.miUserData.username}-${this.otherUserData.username}`;

    componenteHTML.innerHTML = `

            <div id="chat-header">

                <div class="cont-other-username">${otherUserData.username}</div>

                <div class="finished-temchat-button icon-exit" title="Abandonar Temchat"></div>

            </div>

            <div id="chat-body">

            </div>
            
            <div id="chat-footer">
            
                <div id="cont-message-input">

                    <textarea name="" id="message-input" rows="1" data-max-rows="4" placeholder="Escribe Algo..."></textarea>

                </div>

                <div class="send-message-button icon-paperplane" title="Enviar Mensaje"></div>

            </div>
        
        `;

    CONTENEDOR_DE_CHAT_EN_VIVO.appendChild(componenteHTML);

    this.componenteHTML = componenteHTML;

    this.chatBody = document.querySelector(
      `#${this.componenteHTML.id} #chat-body`
    );
    this.sendButton = document.querySelector(
      `#${this.componenteHTML.id} .send-message-button`
    );
    this.messageInput = document.querySelector(
      `#${this.componenteHTML.id} #message-input`
    );

    delegarEvento("click", this.sendButton, () => {
      if (this.sendButton.classList.contains("send-message-button-actived")) {
        this.enviarMensaje();
      }
    });

    this.#configurarTextArea();

    cerrarPuertas(1).then(() => {
      setTimeout(() => {
        let contador = new CountdownTimer(
          3,
          1,
          false,
          0.3,
          COUNT_DOWN_TIMER,
          true,
          0.2,
          "TEMCHAT",
          new Map([
            ["font-size", "min(20vw,15vh)"],
            ["color", "var(--color-logo)"],
            ["font-weight", 300],
          ])
        );

        contador.start().then(() => {
          this.#desplegarChat();
        });
      }, DELAY_FOR_COUNTDOWNTIMER * 1000);
    });

    this.finishedByMe = new Promise((resolve, reject) => {
      delegarEvento(
        "click",
        `#${this.componenteHTML.id} .finished-temchat-button`,
        () => {

          resolve();
          this.finalizarChat();
        }
      );
    });

    this.miSocket.emit("SET-TEMCHAT-USERNAME-ACTUAL", otherUserData.username);

    // EVENTO DE SOCKET PARA RECIBIR MENSAJE
    this.miSocket.on("MESSAGE-FOR-YOU", (contenido) => {
      this.plasmarMensajeRecibido(contenido);
    });
  }

  #configurarTextArea() {
    // Configurando el TextArea
    autosize(this.messageInput);

    const eventoDeTeclado = (event) => {
      if (event.key === "Enter") {
        //Si se esta pulsando shift simplemente dejamos que se cree una nueva linea
        if (event.shiftKey) return;

        event.preventDefault(); // Evita que se inserte una nueva línea

        if (this.messageInput.value.trim() === "") return;

        this.enviarMensaje();
      }

      if (this.messageInput.value.trim() !== "") {
        this.sendButton.classList.add("send-message-button-actived");
      } else {
        this.sendButton.classList.remove("send-message-button-actived");
      }
    };

    delegarEvento("keyup", this.messageInput, eventoDeTeclado);
    delegarEvento("keydown", this.messageInput, eventoDeTeclado);
  }

  #desplegarChat() {
    this.animation = new AnimacionAparicionYDesaparicionConScale(
      this.componenteHTML,
      0.4
    );

    this.animation.iniciar();
  }

  /**
   *
   * @param {Boolean} itIsMe Colocar false si es que no eres tu quien finalizo el TEMCHAT
   */
  finalizarChat(itIsMe = true) {
    if (itIsMe) {
      // desvanecerElementoConScale(
      //   this.componenteHTML,
      //   0.4
      // ).animation.finished.then(() => {
      //   setTimeout(() => {
      //     CONTENEDOR_DE_CHAT_EN_VIVO.removeChild(this.componenteHTML);
      //     abrirPuertas(1);
      //   }, 500);
      // });

      this.animation.iniciar();

      this.animation.finished.then(() => {
        setTimeout(() => {
          CONTENEDOR_DE_CHAT_EN_VIVO.removeChild(this.componenteHTML);
          abrirPuertas(1);
        }, 500);
      });
    } else {
      this.#elOtroUsuarioFinalizoElTemchatMESSAGE();

      // desvanecerElementoConScale(
      //   this.componenteHTML,
      //   0.4
      // ).animation.finished.then(() => {
      //   setTimeout(() => {
      //     CONTENEDOR_DE_CHAT_EN_VIVO.removeChild(this.componenteHTML);
      //     abrirPuertas(1);
      //   }, 500);
      // });

      this.animation.iniciar();

      this.animation.finished.then(() => {
        setTimeout(() => {
          CONTENEDOR_DE_CHAT_EN_VIVO.removeChild(this.componenteHTML);
          abrirPuertas(1);
        }, 500);
      });
    }

    this.miSocket.emit("REMOVE-TEMCHAT-USERNAME-ACTUAL");
  }

  #elOtroUsuarioFinalizoElTemchatMESSAGE() {
    console.log(`${this.otherUserData.username} finalizo el Temchat`);
  }

  /**
   *
   * @param {String} contenido
   */
  enviarMensaje() {
    const contenido_mensaje = this.messageInput.value;

    this.miSocket.emit(
      "(SERVER)MESSAGE-FOR-YOU",
      this.otherUserData.username,
      contenido_mensaje
    );

    let contenido_con_saltos_de_linea_HTML = contenido_mensaje.replace(
      /\n/g,
      "<br>"
    );

    const nuevoMensaje = `
            <div class="cont-mensaje">
                <div class="my-message">${contenido_con_saltos_de_linea_HTML}</div>
            </div>
        `;

    this.chatBody.insertAdjacentHTML("beforeend", nuevoMensaje);

    this.messageInput.value = "";

    this.sendButton.classList.remove("send-message-button-actived");

    this.#mantenerScrollEnParteInferior();
  }

  /**
   *
   * @param {String} contenido
   */
  plasmarMensajeRecibido(contenido = "") {
    let contenido_con_saltos_de_linea_HTML = contenido.replace(/\n/g, "<br>");

    const nuevoMensaje = `
        <div class="cont-mensaje">
            <div class="other-message">${contenido_con_saltos_de_linea_HTML}</div>
        </div>
        `;

    this.chatBody.insertAdjacentHTML("beforeend", nuevoMensaje);

    this.#mantenerScrollEnParteInferior();
  }

  #mantenerScrollEnParteInferior() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }
}

// setTimeout(()=>{

//     let TEMCHAT = new Temchat({username:"juan"},{username:"Maria"});

//     // setTimeout(() => {
//     //     TEMCHAT.finalizarChat();
//     // }, 8000);

// },3000)
