import { UserFound, CONT_USERS_FOUND } from "./UserFound(Class).js";
import { socket } from "./Chat-main.js";
import { MessageInMessagePanel } from "./MessageInMessagePanel(class).js";
import { ChatRequest } from "./ChatRequest(class).js";

window.addEventListener("load", () => {
  const USER_FOUND_INPUT = document.getElementById("usuario-buscado");

  let timer;

  USER_FOUND_INPUT.addEventListener("keyup", (e) => {
    // Cancela el temporizador anterior si existe
    clearTimeout(timer);

    if (USER_FOUND_INPUT.value.match(/^\s*$/))
      return (CONT_USERS_FOUND.innerHTML = "");

    // Colocando texto de carga
    CONT_USERS_FOUND.innerHTML = `<span class="Texto-Carga">Cargando...</span>`;

    const MI_USER_DATA = JSON.parse(sessionStorage.getItem("USER-DATA"));

    // Inicia un nuevo temporizador de 500 milisegundos
    timer = setTimeout(() => {
      fetch(
        `/users?search=${USER_FOUND_INPUT.value}&idExcept=${MI_USER_DATA._id}`
      )
        .then((data) => data.json())
        .then((usuarios) => {
          if (usuarios.length == 0)
            return (CONT_USERS_FOUND.innerHTML = `
                            <span class="Texto-Carga">No se encontraron resultados para ese nombre de usuario.</span>
                        `);
          // VACIANDO CONTENEDOR DE USUARIOS ENCONTRADOS
          CONT_USERS_FOUND.innerHTML = "";
          // console.log(usuarios)
          Array.from(usuarios).forEach((usuario) => {
            if (
              usuario._id !=
              MessageInMessagePanel.currentMessage
                ?.currentOperationUserInformationID
            ) {
              new UserFound(usuario, socket);
            }
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }, 600);
  });

  //Añadiendo Eventos
  const iconosAcceso = document.querySelectorAll(".icono-acceso");
  const Contenedor_Chat_Opcional =
    document.getElementById("cont-chat-opcional");

  iconosAcceso.forEach((icono, index) => {
    icono.addEventListener("click", (e) => {
      if (e.target.classList.contains("icono-selected")) return;

      Contenedor_Chat_Opcional.style.left = `-${100 * index}%`;

      iconosAcceso.forEach((ic) => {
        if (ic === e.target || ic === e.target.parentNode)
          return ic.classList.add("icono-selected");
        ic.classList.remove("icono-selected");
      });
    });
  });
});


window.addEventListener("beforeunload", () => {  
  ChatRequest.rejectAllRequest();
  MessageInMessagePanel.currentMessage?.forceFinish?.(2)  
  socket.emit("DELETE-USER-FROM-DATABASE");
}, true);

