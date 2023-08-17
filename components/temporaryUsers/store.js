const Limite_de_Resultados = 50;

const temporaryUser = require('./model');

async function addTemporaryUser(user) {
    try {

        const nuevoUsuarioTemporal = new temporaryUser(user);
        await nuevoUsuarioTemporal.save();

    } catch (error) {
        throw error;
    }
}


async function getUsersAmount(){
    return await temporaryUser.countDocuments({});
}

async function getUsersByUsernamePattern(searchPattern){
    try {
        // Construir la expresión regular con el valor de searchPattern
        const regex = new RegExp(searchPattern, 'i');
        
        // Utilizar la expresión regular en la consulta
        const usuariosEncontrados = await temporaryUser.find({ username: regex }).limit(Limite_de_Resultados);

        return usuariosEncontrados;

    } catch (error) {
        throw error;
    }
}

async function deleteTemporaryUser(id){
    try {
        return await temporaryUser.deleteOne({ _id: id });
    } catch (error) {
        throw error;
    }  
}   

async function getUserByUsername(username){

    try {
                
        const usuarioEncontrado = await temporaryUser.findOne({ username: username });        
        return usuarioEncontrado;

    } catch (error) {
        throw error;
    }

}

module.exports = {
    add: addTemporaryUser,
    getUsersAmount: getUsersAmount,
    getUsersByUsernamePattern: getUsersByUsernamePattern,
    remove: deleteTemporaryUser,
    getUserByUsername: getUserByUsername
}


