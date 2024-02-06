class CustomEvent {  

    #listeners = new Map();   
    #EventID = 1;
    
    /**
     *
     * @param {()=>void} callback
     * @returns {number} esta funcion devuelve el ID del evento, para poder removerlo mas adelante
     */
    addEventListener(callback) {
      this.#listeners.set(this.#EventID, callback);        
      return this.#EventID++;
    }
  
    /**
     *
     * @param {number} eventID
     */
    removeEventListener(eventID) {
      this.#listeners.delete(eventID);        
    }
    
    dispatchEvent(argumento) {
      for(let callback of this.#listeners.values()) {
        callback(argumento)
      };
    }
  }
  
  module.exports = CustomEvent;