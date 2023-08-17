
import { ChatRequest } from "./ChatRequest(class)";

let ESTADO_ACTUAL = 1;

fetch(`/users/${username}`)
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        USER_DATA = data;
        socket.emit('USER-DATA',JSON.stringify(USER_DATA));
    })
    .catch((e)=>{
        window.location = `${window.location.protocol}//${window.location.host}`
    })


// EN CASO RECIBAS UNA SOLICITUD
socket.on('TEMCHAT-REQUEST-FOR-ME',(requesterUserData,roomID,type,waitTimeRequest)=>{

    const REQUESTER_DATA = JSON.parse(requesterUserData);
    const waitTime = parseFloat(waitTimeRequest);

    const chatRequest = new ChatRequest(REQUESTER_DATA,waitTime);


    if(ESTADO_ACTUAL==2){
        // ACEPTAR SI O SI
        socket.to(REQUESTER_DATA._id).emit('TEMCHAT',()=>{

            socket.emit('CHANGE-STATE',0);

        })
    }

    chatRequest.Promise
        // EN CASO ACEPTES LA SOLICITUD
        .then(()=>{

            socket.emit('CHANGE-STATE',0);

            socket.to(REQUESTER_DATA._id).emit('TEMCHAT');
                        
        })
        .catch(()=>{
            //EN CASO RECHACES LA SOLICITUD
            socket.emit('')

        })


})