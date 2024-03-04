const mongoose = require('mongoose');

const wallet = new mongoose.Schema({
    driver_id : {
        type : String , 
        required : true
    },
    driver_name : {
        type : String,
        required : true
    },
    created_date : {
        type : Date,
        default : Date.now()
    },
    bank_acc_details : {
      name : {
          type : String,
          default : null
      },
      account_number : {
          type : Number,
          default : null
      },
      ifsc_code : {
          type : String,
          default : null
      }
    },
    transanctions : [{
        transanction_id : {
            type : String
        },
        transanction_date : {
            type : Date
        },
        transanction_type : {
            type : String // trip_credits , payout , incentives
        },
        transanction_amount : {
            type : Number
        },
        transanction_party : {
            type : String
        },
        payout : {
            payout_date : {
                type : Date
            },
            payout_status : {
                type : String,
                default : "Pending"
            }
        }
    }],
    inwards : {
        type : Number,
        default : 0
    },
    payout : {
        type : Number,
        default : 0
    },
    income : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('walletDetails' , wallet);
