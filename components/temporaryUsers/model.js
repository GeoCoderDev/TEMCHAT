const mongoose = require('mongoose');
const Shema = mongoose.Schema;

let temporaryUserSchema = new Shema({

    username:{
        type: String,
        require: true,
        validate: (value) => (value!==null&&value!=="")
    },

    // 2 Magnet Mode
    // 1 Disponible
    // 0 No-disponible
    state:{
        type: Number,
        require:true,
        enum:[0,1,2],
        default: 1
    },

    socketConectionID:{
        type: String,
        require:false,
        validate: (value) => (value!==null&&value!=="")
    },

    disconectionsAmount: {
        type: Number,
        require: true,
        default: 0
    }

})

module.exports = mongoose.model("TemporalyUsers",temporaryUserSchema);

