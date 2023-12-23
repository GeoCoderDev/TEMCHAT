const express = require('express');

const controlador = require("./controller");



const router = express.Router();

// SIRVIENDO ARCHIVOS DE CHAT

router.get('/',(req,res)=>{

    // La consulta debe tener un atributo search
    const searchPattern = req.query.search;
    const idExcept = req.query.idExcept;

    if(searchPattern){
        controlador.getUsersByUsernamePattern(searchPattern, idExcept)
        .then((usuarios)=>{
            if(!usuarios){
                const errorUsuariosNoEncontrados = new Error('Usuarios no Encontrados');
                errorUsuariosNoEncontrados.name = "USERS-NOT-FOUND-BY-PATTERN";
                res.status(404).json({error:errorUsuariosNoEncontrados})

            }else{
                res.status(200).json(usuarios)
            }
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).json({ error: 'Error en el servidor', mensaje: 'Hubo un problema al procesar la solicitud' });
        })

    }else{

        

    }

})

router.delete("/:id",(req,res)=>{
    controlador.deleteTemporaryUser(req.params.id)
        .catch((err)=>{
            console.error(err);
            res.status(500).json({ error: 'Error en el servidor', mensaje: 'Hubo un problema al procesar la solicitud' });
        })
})

router.get('/:username', (req, res) => {

    controlador.getUserByUsername(req.params.username)
        .then((usuarioEncontrado) => {
            if (!usuarioEncontrado){
                const errorUsuarioNoEncontrado = new Error('El usuario solicitado no existe')
                errorUsuarioNoEncontrado.name = 'USER-NOT-FOUND';
                // Si no se encuentra el usuario, respondemos con un código 404 y un objeto de error en JSON
                res.status(404).json({ error: errorUsuarioNoEncontrado});
            } else {
                // Si se encuentra el usuario, respondemos con los datos del usuario en JSON
                res.status(200).json(usuarioEncontrado);            
            }
        })
        .catch((err) => {
            // Manejo de errores en caso de que la promesa sea rechazada
            console.error(err);
            res.status(500).json({ error: 'Error en el servidor', mensaje: 'Hubo un problema al procesar la solicitud' });
        });
});

router.post("/",(req,res)=>{

    controlador.addTemporaryUser(req.body.username)
        .catch((err)=>{
            console.error(err);
            res.status(500).json({ error: 'Error en el servidor', mensaje: 'Hubo un problema al procesar la solicitud' });
        })

})


module.exports = router;



