const socketIo = require('socket.io');
const uuid = require('uuid');
const temporaryUsersController = require('../components/temporaryUsers/controller');

/**
 * 
 * @param {Server} server 
 */
function socketManager(server) {

    const io = socketIo(server);

    io.on('connection',(socket) => {

        console.log('User connected:', socket.id);
        
        socket.emit('RES',"HOLA CAPOOOOOO")

        socket.on('USER-DATA',(data)=>{

            const USER_DATA = JSON.parse(data);
            const MY_ROOM_ID = USER_DATA._id;

            console.log(`${USER_DATA.username} esta en su sala ${USER_DATA._id}`);

            // EN CASO HAGAS UNA SOLICITUD A UN USUARIO BUSCADO
            socket.on('TEMCHAT-REQUEST',(searchedUserData,type,waitTime)=>{
                
                // UNIENDOTE A LA SALA DE SOLICITUDES DEL USUARIO BUSCADO
                socket.join(searchedUserData._id);                

                //ENVIANDO LA SOLICITUD... 
                io.to(searchedUserData._id).emit('TEMCHAT-REQUEST-FOR-YOU',USER_DATA,roomID,type,waitTime);
                

                // EN CASO SE ACEPTE TU SOLICITUD
                socket.on('TEMCHAT-FOR-ME',(searchedUserData)=>{
                    console.log(`${USER_DATA._id} hizo TEMCHAT con ${searchedUserData._id}`);
                    
                    

                    // LOGICA DE CHAT


                })

                // EN CASO SE RECHAZE TU SOLICITUD
                socket.on('TEMCHAT-REJECTED-FOR-ME',(strangerData)=>{
                    
                })

            })

            // CUANDO TODOS EN LA SALA RECIBEN UNA SOLICITUD
            socket.on('TEMCHAT-REQUEST-FOR-YOU',(requesterUserData,roomID,type,waitTime)=>{

                // COMO LA SOLICITUD SE ENVIARA PARA TODA LA SALA, IGNORAREMOS LA SOLICITUD
                // EN CASO SE TRATE DEL DUEÑO
                if(USER_DATA._id==requesterUserData._id) return;

                // HACIENDO CONOCIMIENTO DE LA SOLICITUD AL CLIENTE
                socket.emit('TEMCHAT-REQUEST-FOR-ME',requesterUserData,roomID,type,waitTime)

                // EN CASO ACEPTES LA SOLICITUD
                socket.on('TEMCHAT-REQUEST-ACEPPTED-FOR-YOU',()=>{
                    io.to(MY_ROOM_ID).emit('TEMCHAT-REQUEST-ACEPPTED-FOR-YOU',()=>{

                    })
                })


                //EN CASO RECHACES LA SOLICITUD
                socket.on('')



            })

            socket.on('disconnect', () => {
                temporaryUsersController.deleteTemporaryUser(USER_DATA._id);
            });
    
        })

        // En caso el usuario se desconecte
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

    });

}

module.exports = socketManager;
