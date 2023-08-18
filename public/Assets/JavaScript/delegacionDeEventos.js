
// EL "BODY" SIRVE COMO CHIVO EXPIATORIO PARA QUE NO HAGA MATCH EN CASO LO QUE SEA EL PRIMER PARAMETRO SEA UN 
// ELEMENTO HTML , ASI QUE DARA FALSO SIEMPRE QUE SE DEA ESTE CASO YA QUE NUNCA SE PASARIA BODY COMO SELECTOR
// Y SE PROCEDERIA A LA SIGUIENTE PROPOSICION LA CUAL SERIA EXCLUSIVAMENTE PARA ELEMENTOS HTML

// EVENTO CLICK

var mapaDeEventosClick = new Map();
var eventosClickID = 0;

function agregarEventoClick(querySelectorOElementoHTML,callback){
   mapaDeEventosClick.set(eventosClickID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback})    
   return eventosClickID++;;
}

document.addEventListener('click',(e)=>{
    e.stopPropagation();
    mapaDeEventosClick.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});

// EVENTO MOUSEMOVE

var mapaDeEventosMouseMove = new Map();
var eventosMouseMoveID = 0;

function agregarEventoMouseMove(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseMove.set(eventosMouseMoveID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback})     
    return eventosMouseMoveID++;;
}

document.addEventListener('mousemove',(e)=>{

    mapaDeEventosMouseMove.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEOUT

var mapaDeEventosMouseOut = new Map();
var eventosMouseOutID = 0;

function agregarEventoMouseOut(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseOut.set(eventosMouseOutID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseOutID++;
}

document.addEventListener('mouseout',(e)=>{

    mapaDeEventosMouseOut.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
        ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEDOWN

var mapaDeEventosMouseDown = new Map();
var eventosMouseDownID = 0;

function agregarEventoMouseDown(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseDown.set(eventosMouseDownID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseDownID++;
}

document.addEventListener('mousedown',(e)=>{

    mapaDeEventosMouseDown.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEUP

var mapaDeEventosMouseUp = new Map();
var eventosMouseUpID = 0;

function agregarEventoMouseUp(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseUp.set(eventosMouseUpID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseUpID++;
}

document.addEventListener('mouseup',(e)=>{

    mapaDeEventosMouseUp.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEENTER

var mapaDeEventosMouseEnter = new Map();
var eventosMouseEnterID = 0;

function agregarEventoMouseEnter(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseEnter.set(eventosMouseEnterID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseEnterID++;
}

document.addEventListener('mouseenter',(e)=>{

    mapaDeEventosMouseEnter.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO MOUSEOVER

var mapaDeEventosMouseOver = new Map();
var eventosMouseOverID = 0;

function agregarEventoMouseOver(querySelectorOElementoHTML,callback){
    mapaDeEventosMouseOver.set(eventosMouseOverID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosMouseOverID++;
}

document.addEventListener('mouseover',(e)=>{

    mapaDeEventosMouseOver.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO TOUCHSTART

var mapaDeEventosTouchStart = new Map();
var eventosTouchStartID = 0;

function agregarEventoTouchStart(querySelectorOElementoHTML,callback){
    mapaDeEventosTouchStart.set(eventosTouchStartID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosTouchStartID++;
}

document.addEventListener('touchstart',(e)=>{    
    mapaDeEventosTouchStart.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO TOUCHMOVE

var mapaDeEventosTouchMove = new Map();
var eventosTouchMoveID = 0;

function agregarEventoTouchMove(querySelectorOElementoHTML,callback){
    mapaDeEventosTouchMove.set(eventosTouchMoveID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosTouchMoveID++;
}

document.addEventListener('touchmove',(e)=>{

    mapaDeEventosTouchMove.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


// EVENTO TOUCHEND

var mapaDeEventosTouchEnd = new Map();
var eventosTouchEndID = 0;

function agregarEventoTouchEnd(querySelectorOElementoHTML,callback){
    mapaDeEventosTouchEnd.set(eventosTouchEndID,{selectorOElementoHTML:querySelectorOElementoHTML,callback:callback});    
    return eventosTouchEndID++;
}

document.addEventListener('touchend',(e)=>{

    mapaDeEventosTouchEnd.forEach((Evento)=>{
        if(e.target.matches(((typeof Evento.selectorOElementoHTML==="string")?Evento.selectorOElementoHTML:"body"))
            ||e.target==Evento.selectorOElementoHTML){
            Evento.callback(e);
        }
    })

});


/**
 * 
 * @param {*} typeEvent aqui escoges que tipo de evento quieres agregar, ejemplo: click,mousemove,etc
 * @param {*} querySelector este parametro solicita un selector css para el/los elemento(s) que quieres que se aplique el evento
 * @param {*} callback funcion que se ejecutara cada vez que se dispare el evento
 * @returns devuelve un Id del evento que añadiste, con el cual podras eliminar el evento mediante la funcion eliminarEventoDelegado
 */
function delegarEvento(typeEvent,querySelectorOrElement,callback){
    switch (typeEvent) {
        case "click":
            return agregarEventoClick(querySelectorOrElement,callback);

        case "mousemove":
            return agregarEventoMouseMove(querySelectorOrElement,callback);
            
        case "mouseout":
            return agregarEventoMouseOut(querySelectorOrElement,callback);

        case "mousedown":
            return agregarEventoMouseDown(querySelectorOrElement,callback);
        
        case "mouseup":
            return agregarEventoMouseUp(querySelectorOrElement,callback);
        
        case "mouseenter":
            return agregarEventoMouseEnter(querySelectorOrElement,callback);

        case "mouseover":
            return agregarEventoMouseOver(querySelectorOrElement,callback);

        case "touchstart":
            return agregarEventoTouchStart(querySelectorOrElement,callback);

        case "touchmove":
            return agregarEventoTouchMove(querySelectorOrElement,callback);    

        case "touchend":
            return agregarEventoTouchEnd(querySelectorOrElement,callback);

        default:
            console.log("Error 132, delegacionDeEvento.js")
        break;
    }
};


function eliminarEventoDelegado(typeEvent,idEvento){
    switch (typeEvent) {
        case "click":
            mapaDeEventosClick.delete(idEvento);
        break;

        case "mousemove":
            mapaDeEventosMouseMove.delete(idEvento);
        break;

        case "mouseout":
            mapaDeEventosMouseOut.delete(idEvento);
        break;

        case "mousedown":
            mapaDeEventosMouseDown.delete(idEvento);
        break;

        case "mouseup":
            mapaDeEventosMouseUp.delete(idEvento);
        break;

        case "mouseenter":
            mapaDeEventosMouseEnter.delete(idEvento)
        break;

        case "mouseover":
            mapaDeEventosMouseOver.delete(idEvento)
        break;

        case "touchstart":
            mapaDeEventosTouchStart.delete(idEvento)
        break;

        case "touchmove":
            mapaDeEventosTouchMove.delete(idEvento);
        break;

        case "touchend":
            mapaDeEventosTouchEnd.delete(idEvento);
        break;

        default:
            console.log("Error 231, delegacionDeEvento.js")
        break;
    }
};

