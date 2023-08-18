
const MaximaCantidadDeUsuariosConectados = 10;
const store = require('./store');

async function addTemporaryUser(username){

    try{            
        let numeroDeUsuariosActivos = await store.getUsersAmount();
        if (numeroDeUsuariosActivos == MaximaCantidadDeUsuariosConectados) {
            const error = new Error('Cantidad de Usuarios Maxima alcanzada');
            error.name = 'MAX-USERS';
            throw error;
        }

        if(username){

            await getUserByUsername(username)
                .then((usuarioEncontrado)=>{
                    if(usuarioEncontrado){
                        
                        let error = new Error();
                        error.name = "EXISTING-USER";
                        throw error;
                        
                    }else{
                        const newTemporaryUser = {
                            username: username
                        }                                    
                        
                        store.add(newTemporaryUser);
                    }
                })

            
        }else{
            let error = new Error("Datos Incompletos");
            error.name = "INCOMPLETE-USER-DATA";
            throw error;
        }

    }catch(err){
        throw err; 
    }
        
}

async function getUsersByUsernamePattern(searchPattern){
    try {
        
        if(!searchPattern||hasOnlySpaces(searchPattern)) return;        
        await store.getUsersByUsernamePattern(searchPattern)


    } catch (error) {
        throw error
    }
} 


async function deleteTemporaryUser(id){
    try {
        
        if(id){
            store.remove(id);
        }else{
            let error = new Error("Id no valido");
            error.name = "INVALID-ID";
            throw error;
        }

    } catch (error) {
        throw error
    }
}

async function getUserByUsername(username){
    try {
        if(username){
            return await store.getUserByUsername(username);
        }else{
            let error = new Error("username no valido");
            error.name = "EMPTY-USERNAME";
            throw error;
        }        
    } catch (error) {
        throw error;
    }
}


async function getAleatoryUser(idExcept){
    try {
        return await store.getAleatoryUser(idExcept);
    } catch (error) {
        throw error
    }
}

async function setSocketIdConnection(id,socketConectionID){
    try {
        store.setSocketIdConnection(id,socketConectionID);
    } catch (error) {
        throw error;
    }
}

async function changeState(id,state){
    try {
        store.setState(id,state)
    } catch (error) {
        throw error;
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
    changeState: changeState
}