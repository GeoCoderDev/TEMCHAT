
import { CountdownTimer } from "./CountdownTimer(class).js";

const CONT_REQUEST = document.getElementById('cont-request');
const ALTO_REQUEST = "4rem";
const MARGEN_REQUEST = "0 0 min(3vh,1.8vw) 0";
const OPACITY_REQUEST = 0.5;

export class ChatRequest{

    constructor(userData,waitTime){

        if(!userData._id) return null;

        const componenteHTML = document.createElement('div');
            componenteHTML.id = userData._id;
            componenteHTML.classList.add('request');
            componenteHTML.style.display = "none";
        CONT_REQUEST.insertAdjacentElement('afterbegin',componenteHTML)
            
        componenteHTML.innerHTML = `
        
            <div class="cont-request-confirmation">
                <div class="username-request">${userData.username}</div>
                <div class="cont-resquest-buttons">
                    <div class="request-button">ACEPTAR</div>
                    <div class="request-button">RECHAZAR</div>
                </div>
            </div>      
        `;

        componenteHTML.innerHTML += (waitTime)?`<div class="time-request">${waitTime}</div>`:'';

        this.componenteHTML = componenteHTML;        

        this.Promise = new Promise((resolve,reject)=>{
            
            this.cancelRequest = reject;
            // BOTON ACEPTAR
            delegarEvento('click',`#${this.componenteHTML.id} .request-button:nth-child(1)`,()=>{resolve()});
            
            // BOTON RECHAZAR
            delegarEvento('click',`#${this.componenteHTML.id} .request-button:nth-child(2)`,()=>{
                this.#desvanecerElemento();
                reject();
            });

            if(waitTime){
                const contenedorConteo = document.querySelector(`#${this.componenteHTML.id} .time-request`)
                const cuentaRegresiva = new CountdownTimer(waitTime,contenedorConteo);
                cuentaRegresiva.start()
                    .then(()=>{
                        this.#desvanecerElemento().animacionFinalizada
                            .then(()=>{
                                // SOLO SE RECHAZARA LA PROMESA CUANDO LA ANIMACION FINALIZE
                                // LO CUAL HARA QUE NO SE EMITA EL SOCKET DE TEMCHAT
                                // A NO SER QUE EL USUARIO HAGA CLIC EN ACEPTAR
                                // EN EL UTLIMO MOMENTO (QUE CRACK)
                                reject();
                            })
                    
                    })
            }
        })



        this.#desplegarElemento();

    }

    #desplegarElemento(){
        aparecerElemento(this.componenteHTML,0.5,ALTO_REQUEST,'flex',false,MARGEN_REQUEST,OPACITY_REQUEST);
    }

    #desvanecerElemento(){
        return desvanecerElemento(this.componenteHTML,0.4,false,OPACITY_REQUEST);
    }

}




setTimeout(()=>{
    let tt = new ChatRequest({username:"g", _id:"f"},5);   
},2000)