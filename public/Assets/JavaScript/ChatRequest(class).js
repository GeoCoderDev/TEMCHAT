import { CountdownTimer } from "./CountdownTimer(class).js";
export const CONT_REQUEST = document.getElementById("cont-request");
const ALTO_REQUEST = "4rem";
const MARGEN_REQUEST = "0 0 max(1.7vh,1vw) 0";
const OPACITY_REQUEST = 0.5;
const CANTIDAD_SOLICITUDES_HTML = document.getElementById(
  "cantidad-solicitudes"
);

export class ChatRequest {
  static allRequests = new Map();

  animacion;
  cuentaRegresiva = undefined;

  constructor(userData, waitTime) {
    if (!userData._id) return null;
    if (ChatRequest.allRequests.has(userData._id)) return null;
    this.userData = userData;
    const componenteHTML = document.createElement("div");
    this.requesterUserID = userData._id;
    componenteHTML.classList.add("request");

    ChatRequest.allRequests.set(userData._id, this);

    // Para evitar conflictos de referencia por usar el mismo ID en
    // Diferentes elementos HTML

    this.nombreClaseAdicional = `R-${userData._id}`;

    componenteHTML.classList.add(this.nombreClaseAdicional);

    componenteHTML.style.position = "absolute";
    componenteHTML.style.opacity = 0;

    CONT_REQUEST.insertAdjacentElement("afterbegin", componenteHTML);

    componenteHTML.innerHTML = `
        
            <div class="cont-request-confirmation">
                <div class="username-request">${userData.username}</div>
                <div class="cont-resquest-buttons">
                    <div class="request-button">ACEPTAR</div>
                    <div class="request-button">RECHAZAR</div>
                </div>
            </div>      
        `;

    componenteHTML.innerHTML += waitTime
      ? `<div class="time-request">${waitTime}</div>`
      : "";

    this.componenteHTML = document.querySelector(
      `.${this.nombreClaseAdicional}`
    );

    this.Promise = new Promise((resolve, reject) => {
      this.cancelRequest = reject;
      // BOTON ACEPTAR
      this.buttonAcceptEventID = delegarEvento(
        "click",
        `.${this.nombreClaseAdicional} .request-button:nth-child(1)`,
        () => {
          this.desvanecerElemento();
          resolve();
        }
      );

      if (waitTime) {
        const contenedorConteo = document.querySelector(
          `.${this.nombreClaseAdicional} .time-request`
        );
        this.cuentaRegresiva = new CountdownTimer(
          waitTime,
          1,
          true,
          0,
          contenedorConteo
        );

        this.cuentaRegresiva.start().then((info) => {
          this.desvanecerElemento().then(() => {
            // SOLO SE RECHAZARA LA PROMESA CUANDO LA ANIMACION FINALIZE
            // LO CUAL HARA QUE NO SE EMITA EL SOCKET DE TEMCHAT
            // A NO SER QUE EL USUARIO HAGA CLIC EN ACEPTAR
            // EN EL UTLIMO MOMENTO (QUE CRACK)
            if (info?.sinRechazar) return;
            reject();
          });
        });
      }

      // BOTON RECHAZAR
      this.buttonRejectEventID = delegarEvento(
        "click",
        `.${this.nombreClaseAdicional} .request-button:nth-child(2)`,
        () => {
          if (this.cuentaRegresiva) return this.cuentaRegresiva.forceFinish();
          this.desvanecerElemento();
          reject();
        }
      );
    });

    this.#desplegarElemento();

    if (ChatRequest.allRequests.size > 0) {
      CANTIDAD_SOLICITUDES_HTML.style.display = "flex";
      CANTIDAD_SOLICITUDES_HTML.innerText = ChatRequest.allRequests.size;
    }
  }

  #desplegarElemento() {
    // aparecerElemento(
    //   this.componenteHTML,
    //   0.5,
    //   ALTO_REQUEST,
    //   "flex",
    //   false,
    //   MARGEN_REQUEST,
    //   OPACITY_REQUEST
    // );

    this.animacion = new AnimacionAparicionYDesaparicion(
      this.componenteHTML,
      0.5,
      ["request", this.nombreClaseAdicional],
      new Map([
        ["opacity", 0.5],
        ["margin-bottom", "min(2vh, 1.5vw)"],
      ]),
      false
    );

    this.animacion.finished.then(() => this.componenteHTML.remove());

    this.animacion.iniciar();
  }

  #eliminarConfiguraciones() {
    eliminarEventoDelegado("click", this.buttonAcceptEventID);
    eliminarEventoDelegado("click", this.buttonRejectEventID);

    ChatRequest.allRequests.delete(this.requesterUserID);

    if (ChatRequest.allRequests.size == 0)
      CANTIDAD_SOLICITUDES_HTML.style.display = "none";
  }

  desvanecerElemento() {
    this.#eliminarConfiguraciones();
    // INICIAR PARA DESAPARECER
    if(!this.animacion.iniciar()){
      return this.#removerObligatoriamente()
    }

    return this.animacion.finished;
  }

  #removerObligatoriamente(){
    this.componenteHTML.remove();
    this.#eliminarConfiguraciones();
  }

  eliminarPorCancelacion() {
    //Cancelamos el cronometro sin que rechaze la solicitud, puesto que el otro usuario
    //cancelo su solicitud no tu

    if (this.cuentaRegresiva) {
      if (this.cuentaRegresiva.forceFinish) {        
        this.cuentaRegresiva.forceFinish({ sinRechazar: true });
      } else {        
        return this.#removerObligatoriamente()
      }
    }

    return this.desvanecerElemento();
  }

  static rejectAllRequest() {
    for (let chatRequest of ChatRequest.allRequests.values()) {
      chatRequest.desvanecerElemento();
    }
  }

  static get requestUsernames() {
    return Array.from(ChatRequest.allRequests.values()).map(
      (req) => req.userData.username
    );
  }

  static get requestIDs() {
    return Array.from(ChatRequest.allRequests.values()).map(
      (req) => req.userData._id
    );
  }
}
