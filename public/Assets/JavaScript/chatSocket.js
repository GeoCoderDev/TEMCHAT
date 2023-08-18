
import { ChatRequest } from "./ChatRequest(class).js";


let ESTADO_ACTUAL = 1;


socket.emit("MY-USERNAME",myUsername)

// EN CASO RECIBAS UNA SOLICITUD
socket.on('TEMCHAT-REQUEST-FOR-YOU',(requesterUserData,type,waitTimeRequest)=>{

    const REQUESTER_DATA = JSON.parse(requesterUserData);
    const waitTime = parseFloat(waitTimeRequest);

    const chatRequest = new ChatRequest(REQUESTER_DATA,waitTime);

    if(ESTADO_ACTUAL==2){

        // ACEPTAR SI O SI
        socket.to(REQUESTER_DATA.socketConectionID).emit('TEMCHAT',()=>{

            socket.emit('CHANGE-STATE',0);

        })
        
    }

    chatRequest.Promise
        // EN CASO ACEPTES LA SOLICITUD
        .then(()=>{

            socket.emit('CHANGE-STATE',0);            
            

                        
        })
        .catch(()=>{
            //EN CASO RECHACES LA SOLICITUD
            socket.to(USER_DATA._id).emit('')

        })


})





delegarEvento('click','#random-temchat-button',(e)=>{

    socket.emit('GET-ALEATORY-USER');

    socket.emit('TEMCHAT-REQUEST-FOR-ALEATORY-USER');

})


socket.on('TAKE-YOUR-ALEATORY-USER',(aleatoryUser)=>{
    
    console.log(aleatoryUser);

})
