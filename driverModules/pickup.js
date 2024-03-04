// const axios = require('axios');
const pickup = require('express').Router();

const fileUpload = require('express-fileupload');
const { AWS } = require('../middleware/aws');

const tripDetails = require('../models/tripDetails');
const pickupDetails = require('../models/pickupdetails');

const AWSUpload = async (keyname, File) => {

    const s3 = new AWS.S3;
    const params = {
        ACL: "public-read",
        Bucket: 'wagen-wizard',
        Key: keyname, // File name you want to save as in S3
        Body: File
    };

    const result = await s3.upload(params, function (err, data) {
        if (err) {
            return err;
        }
    }).promise();
    return result.Location;
}

pickup.get('/', async (req, res) => {
    res.status(200).send('Bella Ciao !');
});

pickup.get('/allPickupData', async (req, res) => {
    const { transanction_hash } = req.body;

    query = { 'user_id': transanction_hash };

    const result = tripDetails.find(query, function (err, doc) {
        if (err) {
            res.status(501).send(err);
        } else {
            res.status(200).send(doc);
        }
    }).clone();

    res.status(200).send(result);
});


pickup.get('/pickupData', async (req, res) => {
    const { transanction_hash, tripId } = req.body;

    query = {
        'user_id': transanction_hash,
        'trip_id': tripId
    };

    const result = tripDetails.find(query, function (err, doc) {
        if (err) {
            res.status(501).send(err);
        } else {
            res.status(200).send(doc);
        }
    }).clone();

    res.status(200).send(result);
});

pickup.post('/requestCashPickup', async (req, res) => {
    const { transanction_hash, tripId } = req.body;

    const query = {
        'transanction_hash': transanction_hash,
        'trip_id': tripId
    };

    tripDetails.findOne(query, function (err, doc) {
        if (err) {
            res.status(501).send(err);
        } else {
            res.status(200).send('Will be communicated');
        }
    }).clone();
})

pickup.post('/rateTrip', async (req, res) => {

    const { transanction_hash, tripId, rating } = req.body;

    query = {
        'drivers': {
            'assigned': transanction_hash
        },
        'trip_id': tripId,
    }

    update = {
        'ratingByDriver': rating
    }

    tripDetails.findOneAndUpdate(await query, update, function (err, doc) {
        if (err) return res.send(500, { 'error': err });
        return res.status(200).send('Updated');
    }).clone().catch(function (err) { console.log(err) });
});


pickup.post('/postCarPics', async (req, res) => {

    const { transanction_hash, tripId, fbumper , fglass , flshoulder , frshoulder , bbumper , bglass , brshoulder , blshoulder , lf_door , rf_door , lb_door , rb_door , dash , gearknob , trunk , glovebox , backseat , frontseat , overall_picture , overall_comments} = req.body;

    const front_bumper = Buffer.from(fbumper, 'base64');
    const front_glass = Buffer.from(fglass, 'base64');
    const front_lshoulder = Buffer.from(flshoulder, 'base64');
    const front_rshoulder = Buffer.from(frshoulder, 'base64');

    const back_bumper = Buffer.from(bbumper, 'base64');
    const back_glass = Buffer.from(bglass, 'base64');
    const back_lshoulder = Buffer.from(blshoulder, 'base64');
    const back_rshoulder = Buffer.from(brshoulder, 'base64');

    const lfdoor = Buffer.from(lf_door, 'base64');
    const rfdoor = Buffer.from(rf_door, 'base64');
    const lbdoor = Buffer.from(lb_door, 'base64');
    const rbdoor = Buffer.from(rb_door, 'base64');

    const in_dash = Buffer.from(dash, 'base64');
    const in_gearknob = Buffer.from(gearknob, 'base64');
    const in_trunk = Buffer.from(trunk, 'base64');
    const in_glovebox = Buffer.from(glovebox, 'base64');
    const in_backseat = Buffer.from(backseat, 'base64');
    const in_frontseat = Buffer.from(frontseat, 'base64');

    const condition = ["front_bumper", "front_glass", "front_lshoulder", "front_rshoulder", "back_bumper", "back_glass", "back_lshoulder", "back_rshoulder", "lf_door", "rf_door", "lb_door", "rb_door", "dash", "glovebox", "gearknob", "trunk", "backseat", "frontseat"];
    const condition_buffer = [front_bumper, front_glass, front_lshoulder, front_rshoulder, back_bumper, back_glass, back_lshoulder, back_rshoulder, lfdoor, rfdoor, lbdoor, rbdoor, in_dash, in_glovebox, in_gearknob, in_trunk, in_backseat, in_frontseat];
    var condition_url = {};

    var upload = 18;

    if (overall_picture) {
        const overall_pic = Buffer.from(overall_picture, 'base64');
        condition.push("overall_picture");
        condition_buffer.push(overall_pic);
        upload = upload + 1;
    }

    console.log(upload);

    for (let i = 0; i < upload; i++) {
        keyname = "trips/" + tripId + "/" + condition[i] + ".png";
        content = condition_buffer[i];
        var url = await AWSUpload(keyname, content);
        condition_url[condition[i]] = url;
    }

     const pickupObject={
        'transanction_hash': transanction_hash,
        'tripId': tripId,
        'condition': {
            'front': {
                'bumper': condition_url["front_bumper"],
                'glass': condition_url["front_glass"],
                'lshoulder': condition_url["front_lshoulder"],
                'rshoulder': condition_url["front_rshoulder"]
            },
            'back': {
                'bumper': condition_url["back_bumper"],
                'glass': condition_url["back_glass"],
                'lshoulder': condition_url["back_lshoulder"],
                'rshoulder': condition_url["back_rshoulder"]
            },
            'side': {
                'lf_door': condition_url["lf_door"],
                'rf_door': condition_url["rf_door"],
                'lb_door': condition_url["lb_door"],
                'rb_door': condition_url["rb_door"]
            },
            'interior': {
                'dashboard': condition_url["dash"],
                'glovebox': condition_url["glovebox"],
                'gearknob': condition_url["gearknob"],
                'trunk': condition_url["trunk"],
                'backseat': condition_url["backseat"],
                'frontseat': condition_url["frontseat"]
            }
        }
    }

    if (overall_comments) {
        update['condition'].push({ 'overall_comments': overall_comments });
    }

    const pickup =new pickupDetails(pickupObject);

    const query = {
        'tripId' : tripId,
        'drivers' : {
            'selected' : transanction_hash 
        }
    }; 

    const update = {
        'pickupDetail' : pickup
    };

    tripDetails.findOneAndUpdate(await query , update , function(err,doc) {
        if(err) res.status.send({'err' : err});
    });

    await pickup.save(function(err,doc) {
        if(err) res.status(501).send({'err' : err})
        res.status(200).send("Uploaded Successfully");
    });


});
        
module.exports = pickup;