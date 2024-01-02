const LOGO_TEMCHAT_HTML = document.getElementById("logo-temchat");
const MENSAJE_USUARIO = document.getElementById("mensaje-user");
const LOADER_INGRESO = document.getElementById("loader-ingreso");

function eliminarUsuarioAnteriorDeLaBaseDeDatos() {
  if (!sessionStorage.getItem("USER-DATA")) return;

  const LAST_DATA_USER = JSON.parse(sessionStorage.getItem("USER-DATA"));

  fetch(`/users/${LAST_DATA_USER._id}`, { method: "DELETE" }).catch((e) => {
    console.error(e);
  });
}

function eliminarDatosPersistentes() {
  // PROBANDO A ELIMINAR MIS DATOS DE LA BASE DE DATOS POR PRECAUCION
  eliminarUsuarioAnteriorDeLaBaseDeDatos();

  // ELIMINANDO MIS DATOS DE USUARIO ANTERIORES
  sessionStorage.removeItem("USER-DATA");
}

let altoPantallaVisible;
const variableName = "--Alto-Pantalla-Visible";

window.addEventListener("load", () => {
  eliminarDatosPersistentes();

  // Seteando propiedad de alto pantalla visible
  altoPantallaVisible =
    window.visualViewport[
      window.matchMedia("screen and(orientation: landscape)").matches
        ? "width"
        : "height"
    ] + "px";

  document.documentElement.style.setProperty(variableName, altoPantallaVisible);

  const Entry_Form = document.forms["entry-form"];
  const usernameInput = Entry_Form.username;

  Entry_Form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      if (usernameInput.value.trim() === "") {
        MENSAJE_USUARIO.innerText = "Nombre de Usuario no valido";
        return MENSAJE_USUARIO.classList.add("mostrar-block");
      }

      LOADER_INGRESO.classList.add("mostrar-block");

      // CONSULTANDO SI EXISTE EL USUARIO INGRESADO
      let res = await fetch(`/users/${usernameInput.value}`, { method: "GET" });

      let data = await res.json();

      if (data.error?.name == "USER-NOT-FOUND") {
        return (window.location.href = `/chat?username=${usernameInput.value}`);
      }

      MENSAJE_USUARIO.innerText = "Usuario Temporal con ese nombre ya existe";
      return MENSAJE_USUARIO.classList.add("mostrar-block");

    } catch (error) {
      console.error(error);

    } finally {
      LOADER_INGRESO.classList.remove("mostrar-block");
    }
  });

  usernameInput.addEventListener("input", () => {
    return MENSAJE_USUARIO.classList.remove("mostrar-block");
  });

  //   LOGO_TEMCHAT_HTML.addEventListener("animationiteration",()=>{
  //     LOGO_TEMCHAT_HTML.style.animationPlayState = "paused"
  //     setTimeout(()=>{
  //         LOGO_TEMCHAT_HTML.style.animationPlayState = "running";
  //     }, 2000);
  //   });
});

window.addEventListener("resize", () => {
  altoPantallaVisible =
    window.visualViewport[
      window.matchMedia("screen and(orientation: landscape)").matches
        ? "width"
        : "height"
    ] + "px";

  if (parseFloat(window.innerHeight) > parseFloat(altoPantallaVisible)) {
    document.documentElement.style.setProperty(
      variableName,
      window.innerHeight + "px"
    );
  } else {
    document.documentElement.style.setProperty(
      variableName,
      altoPantallaVisible
    );
  }
});

window.addEventListener("popstate", () => {
  eliminarDatosPersistentes();
});

document.addEventListener("visibilitychange", () => {
  eliminarDatosPersistentes();
});
