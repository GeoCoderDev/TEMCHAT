const path = require('path');
const temporaryUserController = require('../temporaryUsers/controller');

function checkUsername(req, res, next) {
    if (req.query.username) {
        // Agregando Usuario
        temporaryUserController.addTemporaryUser(req.query.username)
            .then(() => {
                next();
            })
            .catch((err) => {
                if (err.name == "EXISTING-USER") {
                    return res.redirect('/');
                } else if (err.name == "MAX-USERS") {

                    const dataPage = {
                        tittlePage: "ERROR | TEMCHAT",                        
                        errorMessage: "Servidor Lleno",
                        errorSubMessage: "Lo sentimos, el servidor ha llegado a su capacidad maxima",
                        imageError: false
                      }

                    const errorMessage = "Servidor Lleno";
                    return res.render('Error/index', dataPage); // Renderiza la vista Error/index.ejs con el dato error
                } else {
                    console.log(err);
                    return res.status(500).json({ error: 'Error en el servidor', mensaje: 'Hubo un problema al procesar la solicitud' });
                }
            });
    } else {
        return res.redirect('/');
    }
}

module.exports = checkUsername;
