const trip = require('express').Router();

const workshopDetails = require('../models/workshopProfile');
const tripDetails = require('../models/tripDetails');
const pickupDetails = require("../models/pickupdetails");


trip.post('/new' , async (req , res) => {
 
    const { workshop_id , user_id , mobile_number , vehicle , end } = req.body;
 
    const workshop = await workshopDetails.findOne({'workshop_id' : workshop_id} , function (err,doc) {
        if(err) {
            res.status(501).send(err);
        }
        console.log(doc);
    }).clone();

    const workshopLocation = workshop.location;
    const workshopName = workshop.name;
    const workshopNumber = workshop.contact.mobile_number;
    console.log(workshop)

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

    const trip = new tripDetails({
        'tripId' : makeid(12),
        'created_user' : {
            'user_type' : 'workshop',
            'user_id' : workshop_id
        },
        'pickup_user' : {
            'user_type' : 'customer',
            'user_id' : user_id,
            'contact' : mobile_number
        },
        'drop_user' : {
            'user_type' : 'workshop',
            'user_id' : workshop_id,
            'contact' : workshopNumber
        },
        'vehicle' : vehicle,
        'start' : {
            'name' : workshopName,
            'cordinate' : workshopLocation,
        },
        'end' : end
    });

    await trip.save(function(err , doc) {
        if(err) {
            res.status(501).send(err);
        } else {
            res.status(200).send({
                trip_id : doc.tripId
            });
        }
    });    
})

trip.post("/viewcarpics", async (req, res) => {
    const { workshop_id, tripId } = req.body;
  
    var tripQuery = {
      'tripId': tripId,
      'drop_user': {
        'user_type': 'workshop',
        'user_id': workshop_id
      }
    };
  
    var pickupQuery = {
      'tripId': tripId
    }
  
    const tripexists = tripDetails.findOne(await tripQuery, function (err, doc) {
      if (err) return res.status(500).send(err);
    })
  
    if (tripexists) {
      pickupDetails.findOne(pickupQuery, function (err, doc) {
        if (err) return res.status(500).send(err)
        else {
          var { condition } = doc;
          return res.status(200).send(condition)
        }
      })
    }
  });

trip.post("/viewStatus", async (req, res) => {
    const { trip_id } = req.body;
  
    const tripDetail = await tripDetails.findOne({ trip_id: trip_id });
  
    if (!tripDetail) return res.status(500).send("error");
  
    return res.status(200).send({ status: tripDetail.status });
  });
  
trip.post("/")

module.exports = trip;