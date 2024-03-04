const mongoose = require('mongoose');
const { Schema } = mongoose;

const routeDetail = new Schema({

    tripId : {
        type : String,
        required : true,
        // unique : true
    },
    path : {
        type : [[Number]],
        default : [[0.0,0.0]]
    }

})

module.exports = new mongoose.model("routeTaken" , routeDetail);
