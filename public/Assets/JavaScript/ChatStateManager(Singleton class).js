import { socket } from "./Chat-main.js";
import { ChatEvent } from "./ChatEvent(Class).js";

export class ChatStateManager {
  static instance;

  //0: Ocupado
  //1: Disponible
  //2: Modo Iman
  #ESTADO_ACTUAL = 1;

  #TEMCHAT_ACTUAL = undefined;

  PERSISTENCIA_CHAT_RANDOM_ACTIVADO = false;

  NuevoChatRequest = new ChatEvent();  

  set ESTADO_ACTUAL(state) {
    this.#ESTADO_ACTUAL = state;
    socket.emit("CHANGE-STATE", state);
  }  

  get ESTADO_ACTUAL() {
    return this.#ESTADO_ACTUAL;
  }

  set TEMCHAT_ACTUAL(temchat){

    this.#TEMCHAT_ACTUAL = temchat;

  }

  get TEMCHAT_ACTUAL(){
    return this.#TEMCHAT_ACTUAL;
  }

  constructor() {
    if (!ChatStateManager.instance) {
      ChatStateManager.instance = this;
    }

    return ChatStateManager.instance;
  }
    
}
