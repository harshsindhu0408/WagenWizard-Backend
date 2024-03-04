const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const login = require('express').Router();


const driver = require('../models/driverProfile');
const accountSid = process.env.twilioAccountSid;
const authToken = process.env.twilioAuthToken;
const client = require('twilio')(accountSid, authToken);
const twilio_service_id=process.env.twilioServiceId;

login.post('/number' , jsonParser , async (req , res) => {
    const { number } = req.body; 
    console.log(req.body)
    console.log(number)
    var status; 
    function set(number) {
      status = number;
    }
    console.log(req.body);
    await client.verify.v2.services(twilio_service_id)
             .verifications
             .create({to: number, channel: 'sms'})
             .then(verification => set(verification.status));
    if(status == "pending") {
      res.send(200);
    } else {
      res.send(500);
    }
});

login.get('/' , (req , res) => {
  res.send("it works");
});

login.post('/verifyOtp' , async (req , res) => {
    const { number , otp } = req.body;
  
    var status; 
    function set(number) {
      status = number;
    }  
  
      function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
      }
      return result;
    }
  
    await client.verify.v2.services(twilio_service_id)
    .verificationChecks
        .create({to: number, code: otp})
        .then(verification_check =>{ 
          // console.log(verification_check);
          set(verification_check.status)});
    if(status == "approved") {
      hash = makeid(14);

      const driverP1 = new driver({
        transanction_hash : hash,
        contact : {
          mobile_number : number
        }
      });

      await driverP1.save();
      
      res.send({ 'transanction_hash' : hash });
    } else {
      res.status(404).send("Invalid OTP");
    }
  });


module.exports = login;