import { CountdownTimer } from "./CountdownTimer(class).js";
export const CONT_REQUEST = document.getElementById("cont-request");
const ALTO_REQUEST = "4rem";
const MARGEN_REQUEST = "0 0 max(1.7vh,1vw) 0";
const OPACITY_REQUEST = 0.5;

export class ChatRequest {
  constructor(userData, waitTime) {
    if (!userData._id) return null;

    const componenteHTML = document.createElement("div");
    this.requesterUserID = userData._id;
    componenteHTML.classList.add("request");
    // Para evitar conflictos de referencia por usar el mismo ID en
    // Diferentes elementos HTML
    componenteHTML.classList.add(`R-${userData._id}`);
    componenteHTML.style.display = "none";
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

    this.componenteHTML = document.querySelector(`.R-${userData._id}`);

    this.Promise = new Promise((resolve, reject) => {
      this.cancelRequest = reject;
      // BOTON ACEPTAR
      this.buttonAcceptEventID = delegarEvento(
        "click",
        `.R-${userData._id} .request-button:nth-child(1)`,
        () => {          
          this.desvanecerElemento();
          resolve();
        }
      );

      // BOTON RECHAZAR
      this.buttonRejectEventID = delegarEvento(
        "click",
        `.R-${userData._id} .request-button:nth-child(2)`,
        () => {
          this.desvanecerElemento();
          reject();
        }
      );

      if (waitTime) {
        const contenedorConteo = document.querySelector(
          `.R-${userData._id} .time-request`
        );
        const cuentaRegresiva = new CountdownTimer(waitTime, contenedorConteo);
        cuentaRegresiva.start().then(() => {
          this.desvanecerElemento().animacionFinalizada.then(() => {
            // SOLO SE RECHAZARA LA PROMESA CUANDO LA ANIMACION FINALIZE
            // LO CUAL HARA QUE NO SE EMITA EL SOCKET DE TEMCHAT
            // A NO SER QUE EL USUARIO HAGA CLIC EN ACEPTAR
            // EN EL UTLIMO MOMENTO (QUE CRACK)
            reject();
          });
        });
      }
    });

    this.#desplegarElemento();

    ChatRequest.allRequests.set(userData._id,this);

  }

  #desplegarElemento() {
    aparecerElemento(
      this.componenteHTML,
      0.5,
      ALTO_REQUEST,
      "flex",
      false,
      MARGEN_REQUEST,
      OPACITY_REQUEST
    );
  }

  desvanecerElemento() {
    
    eliminarEventoDelegado("click", this.buttonAcceptEventID);
    eliminarEventoDelegado("click", this.buttonRejectEventID);

    ChatRequest.allRequests.delete(this.requesterUserID);

    return desvanecerElemento(this.componenteHTML, 0.4, false, OPACITY_REQUEST,undefined,undefined,CONT_REQUEST);

  }

  // #setRequest(){
  //     if(!ChatRequest.allRequests) ChatRequest.allRequests = [];
  //     ChatRequest.allRequests.push(this)
  //     ChatRequest.
  // }

  // ChatRequest.allRequests tiene que ser un Map
  // static rejectAllRequests(){
  //     if(ChatRequest.allRequests){
  //         for (request of myMap.values()) {
  //             request.cancelRequest();
  //           }
  //     }
  // }
}

ChatRequest.allRequests = new Map();
