const socketIo = require('socket.io');
const uuid = require('uuid');
const temporaryUsersController = require('../components/temporaryUsers/controller');
const controller = require('../components/temporaryUsers/controller');


/**
 * 
 * @param {Server} server 
 */
function socketManager(server) {

    const io = socketIo(server);

    io.on('connection',(socket) => {

        console.log('User connected:', socket.id);

        socket.on('MY-USERNAME',(username)=>{            

            let USER_DATA
            controller.getUserByUsername(username)
                .then((usuarioEncontrado)=>{

                    USER_DATA = usuarioEncontrado;

                    temporaryUsersController.setSocketIdConnection(USER_DATA._id,socket.id)
                    .catch((e)=>{
                        console.error(e)
                    })
    
                    console.log(`${USER_DATA.username} conectado`);
        

                    socket.on('GET-ALEATORY-USER',()=>{

                        temporaryUsersController.getAleatoryUser(USER_DATA._id)
                            .then((usuarioAleatorio)=>{
                                socket.emit('TAKE-YOUR-ALEATORY-USER',JSON.stringify(usuarioAleatorio),JSON.stringify(USER_DATA));
                            })
                            .catch((e)=>{
                                console.error(e)
                            })

                        
                    })

                    socket.on('TEMCHAT-REQUEST-FOR-ALEATORY-USER',()=>{

                        temporaryUsersController.getAleatoryUser(USER_DATA._id)
                            .then((usuarioAleatorio)=>{
                                
                                const Usuario_Aleatorio = usuarioAleatorio[0];
                                socket.to(Usuario_Aleatorio.socketConectionID).emit('TEMCHAT-REQUEST-FOR-YOU',JSON.stringify(USER_DATA),"Random-Temchat");                                
                                

                            })
                            .catch((e)=>{
                                console.error(e)
                            })

                    })

                    socket.on('TEMCHAT-ACCEPTED-FOR-YOU',()=>{

                    })

                    socket.on('TEMCHAT-REJECTED-FOR-YOU',()=>{

                    })

                    socket.on('CHANGE-STATE',(state)=>{
                        temporaryUsersController.changeState(USER_DATA._id,state)
                    })

                    socket.on('disconnect', () => {
                        temporaryUsersController.deleteTemporaryUser(USER_DATA._id);
                    });

                })                        
                .catch((err)=>{
                    console.error(err);
                })
                

    
        })

        // En caso el usuario se desconecte
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

    });

}

module.exports = socketManager;
