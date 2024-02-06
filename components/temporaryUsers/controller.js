const Maxima_Cantidad_Usuarios_Conectados = 10;
const Cantidad_Maxima_Desconexiones = 2;
const store = require("./store");

async function addTemporaryUser(username) {
  try {
    let numeroDeUsuariosActivos = await store.getUsersAmount();
    if (numeroDeUsuariosActivos == Maxima_Cantidad_Usuarios_Conectados) {
      const error = new Error("Cantidad de Usuarios Maxima alcanzada");
      error.name = "MAX-USERS";
      throw error;
    }

    if (username) {
      await getUserByUsername(username).then((usuarioEncontrado) => {
        if (usuarioEncontrado) {
          let error = new Error();
          error.name = "EXISTING-USER";
          throw error;
        } else {
          const newTemporaryUser = {
            username: username,
          };

          store.add(newTemporaryUser);
        }
      });
    } else {
      let error = new Error("Datos Incompletos");
      error.name = "INCOMPLETE-USER-DATA";
      throw error;
    }
  } catch (err) {
    throw err;
  }
}

async function getUsersByUsernamePattern(searchPattern, idExcept) {
  try {
    if (!searchPattern || hasOnlySpaces(searchPattern)) return;
    return await store.getUsersByUsernamePattern(searchPattern, idExcept);
  } catch (error) {
    throw error;
  }
}

async function deleteTemporaryUser(id) {
  try {
    if (id) {
      store.remove(id);
    } else {
      let error = new Error("Id no valido");
      error.name = "INVALID-ID";
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    if (username) {
      return await store.getUserByUsername(username);
    } else {
      let error = new Error("username no valido");
      error.name = "EMPTY-USERNAME";
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {string[]} idsExcept
 * @returns
 */
async function getAleatoryUser(idsExcept, estadoAFiltrar) {
  try {
    return await store.getAleatoryUser(idsExcept, estadoAFiltrar);
  } catch (error) {
    throw error;
  }
}

async function setSocketIdConnection(id, socketConectionID) {
  try {
    store.setSocketIdConnection(id, socketConectionID);
  } catch (error) {
    throw error;
  }
}

async function setDisconectionsAmount(id, newAmount) {
  try {
    if (newAmount > Cantidad_Maxima_Desconexiones)
      return deleteTemporaryUser(id);

    store.setDisconectionsAmount(id, newAmount);
  } catch (error) {
    throw error;
  }
}

async function changeState(id, state) {
  try {
    store.setState(id, state);
  } catch (error) {
    throw error;
  }
}

async function getSocketIDByID(userID) {
  try {
    return await store.getSocketIDByID(userID);
  } catch (err) {
    throw err;
  }
}

function hasOnlySpaces(string) {
  const regex = /^\s*$/; // Expresión regular que coincide con espacios en blanco en un string
  return regex.test(string);
}

module.exports = {
  addTemporaryUser: addTemporaryUser,
  deleteTemporaryUser: deleteTemporaryUser,
  getUsersByUsernamePattern: getUsersByUsernamePattern,
  getUserByUsername: getUserByUsername,
  getAleatoryUser: getAleatoryUser,
  setSocketIdConnection: setSocketIdConnection,
  changeState: changeState,
  getSocketIDByID: getSocketIDByID,
  setDisconectionsAmount,
};
