const Limite_de_Resultados = 50;

const temporaryUser = require("./model");

async function addTemporaryUser(user) {
  try {
    const nuevoUsuarioTemporal = new temporaryUser(user);
    await nuevoUsuarioTemporal.save();
  } catch (error) {
    throw error;
  }
}

async function getUsersAmount() {
  return await temporaryUser.countDocuments({});
}

async function getUsersByUsernamePattern(searchPattern, idExcept) {
  try {
    // Construir la expresión regular con el valor de searchPattern
    const regex = new RegExp(searchPattern, "i");

    // Utilizar la expresión regular en la consulta
    const usuariosEncontrados = await temporaryUser
      .find({ username: regex, _id: { $ne: idExcept } })
      .limit(Limite_de_Resultados);

    return usuariosEncontrados;
  } catch (error) {
    throw error;
  }
}

async function deleteTemporaryUser(id) {
  try {
    return await temporaryUser.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const usuarioEncontrado = await temporaryUser.findOne({
      username: username,
    });
    return usuarioEncontrado;
  } catch (error) {
    throw error;
  }
}

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

async function setState(id, state) {
  try {
    await temporaryUser.updateOne({ _id: id }, { $set: { state: state } });
  } catch (error) {
    throw error;
  }
}

async function getAleatoryUser(idExcept) {
  try {
    return await temporaryUser.aggregate([
      { $match: { _id: { $ne: idExcept } } }, // Excepcion para el idExcept
      { $match: { state: { $in: [1, 2] } } }, // Filtrar por estado 1 o 2
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
};
