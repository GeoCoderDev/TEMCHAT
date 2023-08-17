//Funcion para responder mensajes
exports.success = function(req,res,mensaje,status){
    res.status(status||200).send({error:'',body:mensaje});
}

//Funcion para enviar mensajes de error
exports.error = function(req,res,error,status){
    res.status(status||500).send({error:error,body:''});
}
