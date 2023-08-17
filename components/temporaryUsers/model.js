const mongoose = require('mongoose');
const Shema = mongoose.Schema;

let temporaryUserSchema = new Shema({

    username:{
        type: String,
        require: true,
        validate: (value) => (value!==null&&value!=="")
    },

    // 2 Open Mode
    // 1 Disponible
    // 0 No-disponible
    estado:{
        type: Number,
        require:true,
        enum:[0,1,2],
        default: 1
    }

    // socketConectionID:{
    //     type: String,
    //     require:true,
    //     validate: (value) => (value!==null&&value!=="")
    // }

})

module.exports = mongoose.model("TemporalyUsers",temporaryUserSchema);

