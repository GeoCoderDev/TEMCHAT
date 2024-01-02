// OBTENIENDO NUESTRO SOCKET
export const socket = io.connect();

// MENU-PRINCIPAL
const MAIN_INTERFACE = document.getElementById("main-interface");
const CONT_LIVE_CHAT = document.getElementById("cont-live-chat");

// PUERTAS
const PUERTA1 = document.getElementById("Puerta-1");
const PUERTA2 = document.getElementById("Puerta-2");

socket.on("TAKE-YOUR-USER-DATA", (miUserData) => {
  // GUARDANDO EN FORMATO JSON, EN CASO DE QUE EL SOCKET SE RECONECTE
  // LOS DATOS SE SOBREESCRIBIRAN EN SESSION STORAGE, PORQUE RECUERDA QUE
  // CADA VEZ QUE TE CONECTES O TE RECONECTES SE ACTIVARA EL EVENTO CONNECT EN EL
  // SERVIDOR, LO QUE HAYA QUE ESTE EVENTO "TAKE-YOUR-USER-DATA" SE DISPARE
  // OTRA VEZ
  sessionStorage.setItem("USER-DATA", miUserData);
});

document.addEventListener("visibilitychange", () => {
  //Si se hizo un cambio en la visibilidad del documento, significa que el usuario
  // salio de la pestaña, o la minimizo, en celulares el navegador desconecta
  // el socket al apagar la pantalla, y luego al prenderla en la misma pagina
  // se vuelve a conectar,por esa razon antes de decidir que si hubo un cambio de socket
  // se procede a comprobar que USER-DATA estea en el sessionstorage, si esta
  // significa que hubo un cambio de socket solamente
  if (
    sessionStorage.getItem("USER-DATA") &&
    document.visibilityState === "visible"
  ) {
    const MI_USER_DATA = JSON.parse(sessionStorage.getItem("USER-DATA"));
    if (socket.id != MI_USER_DATA.socketConectionID) {
      socket.emit("MY-USERNAME", myUsername);
    }
  }
});

window.addEventListener("beforeunload", () => {
  socket.emit("DELETE-USER-FROM-DATABASE");
});

let altoPantallaVisible;
const variableName = "--Alto-Pantalla-Visible";

window.addEventListener("load", () => {
  altoPantallaVisible = window.visualViewport.height + "px";
  document.documentElement.style.setProperty(variableName, altoPantallaVisible);
});

window.addEventListener("resize",()=>{

  if(!altoPantallaVisible) return;

  if(parseFloat(window.innerHeight) > parseFloat(altoPantallaVisible)){
    document.documentElement.style.setProperty(variableName, window.innerHeight + "px");
  }else{
    document.documentElement.style.setProperty(variableName, altoPantallaVisible);
  }

});

export function cerrarPuertas(duracionSegundos, easing = "ease-in") {
  PUERTA1.animate([{ width: 0 }, { width: "50%" }], {
    duration: duracionSegundos * 1000,
    iterations: 1,
    easing: easing,
    fill: "forwards",
  }).finished.then(() => {
    MAIN_INTERFACE.style.display = "none";
    CONT_LIVE_CHAT.style.display = "flex";
  });

  return PUERTA2.animate([{ width: 0 }, { width: "50%" }], {
    duration: duracionSegundos * 1000,
    iterations: 1,
    easing: easing,
    fill: "forwards",
  }).finished;
}

export function abrirPuertas(duracionSegundos, easing = "ease-in") {
  MAIN_INTERFACE.style.display = "flex";
  CONT_LIVE_CHAT.style.display = "none";

  PUERTA1.animate([{ width: "50%" }, { width: 0 }], {
    duration: duracionSegundos * 1000,
    iterations: 1,
    easing: easing,
    fill: "forwards",
  });

  return PUERTA2.animate([{ width: "50%" }, { width: 0 }], {
    duration: duracionSegundos * 1000,
    iterations: 1,
    easing: easing,
    fill: "forwards",
  }).finished;
}

function determinarOrientacion() {
  let orientacion;

  if (window.innerWidth > window.innerHeight) {
    orientacion = "LANDSCAPE";
  } else {
    orientacion = "PORTRAIT";
  }

  return orientacion;
}
