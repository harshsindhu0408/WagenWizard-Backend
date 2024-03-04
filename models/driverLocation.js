const mongoose = require('mongoose');
const { Schema } = mongoose;

const drive_location = new Schema({
    driver_id : {
        type : String,
        required : [true , '1']
    },
    cordinates : {
        type : [Number],
        default : [0.0,0.0] // [latitude,longitude]
    },
    status : {
        type : String,
        default : "available" // available , offline , online , engaged
    }
});

module.exports =  mongoose.model('driverLocation', drive_location);
