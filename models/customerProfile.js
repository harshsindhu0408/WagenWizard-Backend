const mongoose = require    ("mongoose");  
const { Schema } = mongoose;

//min 18 age checker.
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear()-18;
    today = yyyy +'-' + mm + '-' + dd;
    return today;
}

const user_profile = new Schema({
    user_id : {
        type : String,
        required : [true , 'A must !!']
    },
    name : {
        type : String
    },
    contact : {
        mobile_number : {
            type : Number,
            required : [true , 'Phone number is compulsory !'],
            min : 10
        },
        mail_id: {
      type: String,
    //   unique: [true, "email id is already present"],

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
        address : {
            type : String
        },
    },
    vehicle : [{
        vehicleModel : String,
        vehicleNumber : String
    }],
    location : [{
        name : String,
        cordinates : [Number]
    }],
    customer_rating : {
        type : Number,
        default : 3
    },
    dob : {
        type : Date,
        max : getDate()
    }
});

module.exports = mongoose.model('userProfile' , user_profile);
