const Limite_de_Resultados = 50;

const temporaryUser = require("./model");

/**
 *
 * @param {object} user
 */
async function addTemporaryUser(user) {
  try {
    const nuevoUsuarioTemporal = new temporaryUser(user);
    await nuevoUsuarioTemporal.save();
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @returns {string | number}
 */
async function getUsersAmount() {
  return await temporaryUser.countDocuments({});
}

/**
 * Obtiene usuarios que coinciden con un patrón de nombre de usuario, excluyendo un usuario específico.
 * @param {RegExp} searchPattern - Patrón de búsqueda para el nombre de usuario.
 * @param {string} idExcept - ID del usuario a excluir de los resultados.
 * @returns {Array} - Un array de usuarios encontrados.
 * @throws {Error} - Se lanza si hay algún error durante la consulta.
 */
async function getUsersByUsernamePattern(searchPattern, idExcept) {
  try {
    // Construir la expresión regular con el valor de searchPattern
    const regex = new RegExp(searchPattern, "i");

    // Utilizar la expresión regular en la consulta y excluir al usuario especificado
    const usuariosEncontrados = await temporaryUser
      .find({ username: regex, _id: { $ne: idExcept } })
      .lean()
      .limit(Limite_de_Resultados);

    // Puedes agregar lógica adicional de procesamiento aquí si es necesario

    return usuariosEncontrados;
  } catch (error) {
    console.error("Error en getUsersByUsernamePattern:", error.message);
    throw error;
  }
}

/**
 *
 * @param {string | number} id
 *
 */
async function deleteTemporaryUser(id) {
  try {
    return await temporaryUser.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {string} username
 * @returns {}
 */
async function getUserByUsername(username) {
  try {
    return await temporaryUser
      .findOne({
        username: username,
      })
      .lean();
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {string} id
 * @param {string} socketConectionID
 */
async function setSocketIdConnection(id, socketConectionID) {
  try {
    await temporaryUser.updateOne(
      { _id: id },
      { $set: { socketConectionID: socketConectionID } }
    );
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {string} id
 * @param {number} state
 */
async function setState(id, state) {
  try {
    await temporaryUser.updateOne({ _id: id }, { $set: { state: state } });
  } catch (error) {
    throw error;
  }
}

/**
 * 
 * @param {string} id 
 * @param {number} newAmount 
 */
async function setDisconectionsAmount(id, newAmount) {
  try {
    await temporaryUser.updateOne(
      { _id: id },
      { $set: { disconectionsAmount: newAmount } }
    );
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {string[]} idsExcept
 * @returns
 */
async function getAleatoryUser(idsExcept = [], estadoAFiltrar = 1) {
  try {
    return await temporaryUser.aggregate([
      { $match: { _id: { $nin: idsExcept } } }, // Excepciones para el _id
      { $match: { state: { $in: [estadoAFiltrar] } } }, // Filtrar por estado
      { $sample: { size: 1 } }, // Seleccionar un documento aleatorio de los resultados
    ]);
  } catch (error) {
    throw error;
  }
}

async function getSocketIDByID(userID) {
  try {
    // Definir las proyecciones para obtener solo el campo "socketConectionID"
    // Cabe resaltar que si quieres que cierto campo se excluya basta con no considerarlo en
    // las proyecciones, sin embargo la propiedad _id para que no sea considerada si es
    // necesario indicar en las proyecciones de manera explicita con un 0 de la siguiente manera:
    const proyecciones = { _id: 0, socketConectionID: 1 };
    return await temporaryUser.findOne(
      { _id: userID },
      { projection: proyecciones }
    );
  } catch (err) {
    throw err;
  }
}

module.exports = {
  add: addTemporaryUser,
  getUsersAmount: getUsersAmount,
  getUsersByUsernamePattern: getUsersByUsernamePattern,
  remove: deleteTemporaryUser,
  getUserByUsername: getUserByUsername,
  setSocketIdConnection: setSocketIdConnection,
  setState: setState,
  getAleatoryUser: getAleatoryUser,
  getSocketIDByID: getSocketIDByID,
  setDisconectionsAmount
};
