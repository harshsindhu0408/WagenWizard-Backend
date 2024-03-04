const createUser = require('express').Router();

const workshopModel = require('../models/workshopProfile');
const driverModel = require('../models/driverProfile');

createUser.get('/' , async(req , res) => {
    res.send('Bella Ciao !!');
});

createUser.post('/createWorkshop' , async(req , res) => {

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
      }
      result = "WOR"+result;
      return result;
    }

    const { name , mobile_number , location , doi } = req.body;

    const workshop = new workshopModel({
        'workshop_id' : makeid(7),
        'name' : name,
        contact : {
            'mobile_number' : mobile_number
        },
        'location' : location,
        'doi' : doi
    });

    await workshop.save(function(err,doc) {
        if(err) {
            res.status(501).send(err);
        } else {
            res.status(200).send(doc);
        }
    });
});

module.exports = createUser;


// --- TO CREATE A NEW DRIVER FROM ADMIN PANEL ---
// createUser.post('/createDriver' , async (req,res) => {

// })