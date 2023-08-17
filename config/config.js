const db = require('mongoose');

db.Promise = global.Promise;

//'mongodb+srv://juanito:juan3000j@cluster0.ezmvwc9.mongodb.net/test'

async function connect(url){

    await db.connect(url,{
        useNewUrlParser: true,
    });

    console.log('[db] Conectada con exito');

}


module.exports = connect;