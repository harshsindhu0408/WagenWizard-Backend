const mongoose = require    ("mongoose");  
const { Schema } = mongoose;

const workshop_details = new Schema({
    workshop_id : {
        type : String,
        required : [true , 'A must !!']
    },
    name : {
        type : String,
        required : true
    },
    profile_pic : {
        url : String
    },
    contact : {
        mobile_number : {
            type : Number,
            required : [true , 'Phone number is compulsory !'],
            min : 10
        },
        mail_id: {
      type: String,
      unique: [true, "email id is already present"],

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
    location : {
        type : [Number], // [latitude,longitude]
        default : [0.0,0.0]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    doi : {
        type : Date,
        required : true
    },
    documents: {
    service_center_incorporation_certifiacte: {
      url: String,
    },
    address_proof: {
      url: String,
    },
    gstin: {
      url: String,
    },
    identity_proof: {
      url: String,
    },
  },
    workshop_rating : {
        type : Number,
        default : 3
    }
});

module.exports = mongoose.model('workshopProfile' , workshop_details);
