const profile = require("express").Router();

const driverProfile = require("../models/driverProfile");
const driverLocation = require("../models/driverLocation");
const path = require("path");
const { AWS } = require("../middleware/aws");

const AWSUpload = async (keyname, File) => {
  const s3 = new AWS.S3();
  console.log("inside AWSUpload");
  const params = {
    ACL: "public-read",
    Bucket: "wagen-wizard",
    Key: keyname, // File name you want to save as in S3
    Body: File,
  };

  const result = await s3
    .upload(params, function (err, data) {
      if (err) {
        return err;
      }
    })
    .promise();
  return result.Location;
};

profile.post("/personalInfo", async (req, res) => {
  const { transanction_hash, name, mail, dob, tee_size } = req.body;
  const driverPersonal = {
    name: name,
    mail_id: mail,
    dob: dob,
    tee_size: tee_size,
  };
  console.log(req.body);

  query = {
    transanction_hash: transanction_hash,
  };
  const resp = await driverProfile.findOneAndUpdate(query, driverPersonal, {
    new: true,
  });
  if (resp) {
    res.status(200).send("Succesfully saved.");
  } else {
    res.status(400).send("Some error occured");
  }
  // await driverProfile.findOneAndUpdate( await query , driverPersonal , function(err, doc) {
  //     if (err) return res.send(500, {'error': err});
  //     return res.status(200).send('Succesfully saved.');
  // }).clone().catch(function(err){ console.log(err)});
});

profile.get("/getPersonalInfo/:transanction_hash", async (req, res) => {
  const  transanction_hash  = req.params.transanction_hash;
  console.log(req.params.transanction_hash)
  console.log(transanction_hash)
  const profile = await driverProfile
    .find({ transanction_hash: transanction_hash })
    console.log(profile)
    if (profile[0] == undefined) {
      res.status(400).send("No profile found");
    }
  res.status(200).send(profile[0]);
});

profile.post("/uploadProfilePic", async (req, res) => {
  try {
    var { transanction_hash } = req.body;
    const { pp } = req.body;
    var pp_content = Buffer.from(pp, "base64");
    console.log(req.body);
  } catch (err) {
    console.log(502);
    res.status(501).send(req.body);
    console.log(503);
  }

  const keyname = "profilepics/" + transanction_hash + ".png";
  // Setting up S3 upload parameters
  var result = await AWSUpload(keyname, pp_content);
  console.log("result" + result);
  query = {
    transanction_hash: transanction_hash,
  };

  update = {
    profile_pic: {
      url: result,
    },
  };

  const resp = await driverProfile.findOneAndUpdate(query, update, {
    new: true,
  });
  console.log(resp);
  if (resp) {
    res.status(200).send("Succesfully saved.");
  } else {
    res.status(400).send("Some error occured");
  }
  // driverProfile.findOneAndUpdate(query , update , function(err,doc) {
  //     if (err) return res.send(500, {error: err});
  //     return res.status(200).send('Succesfully saved.');
  // }).clone().catch(function(err){ console.log(err)});
});

profile.post("/updateKYCDocs", async (req, res) => {
  const { transanction_hash } = req.body;

  const {
    aadhar_card_front,
    aadhar_card_back,
    pan_card,
    driving_license_front,
    driving_license_back,
    residential_proof,
  } = req.body;
  const aadhar_cont_front = Buffer.from(aadhar_card_front, "base64");
  const aadhar_cont_back = Buffer.from(aadhar_card_back, "base64");
  const pan_content = Buffer.from(pan_card, "base64");
  const driving_cont_front = Buffer.from(driving_license_front, "base64");
  const driving_cont_back = Buffer.from(driving_license_back, "base64");
  const residential_content = Buffer.from(residential_proof, "base64");

  const docs = [
    "aadhar_front",
    "aadhar_back",
    "pan",
    "driving_license_front",
    "driving_license_back",
    "residential_proof",
  ];
  const docs_buffer = [
    aadhar_cont_front,
    aadhar_cont_back,
    pan_content,
    driving_cont_front,
    driving_cont_back,
    residential_content,
  ];
  const docsurl = {};

  for (let i = 0; i < 4; i++) {
    keyname = "kycdocs/" + transanction_hash + "/" + docs[i] + ".png";
    docsurl[docs[i]] = await AWSUpload(keyname, docs_buffer[i]);
  }
  res.status(200).send(JSON.stringify(docsurl));
});

profile.post("/getPaymentHistory", async (req, res) => {
  const { transanction_hash } = req.body;

  const trips = await driverProfile
    .find({ transanction_hash: transanction_hash }, function (err, doc) {})
    .clone();
  const totalPayment = 0;
  const paymentHistory = [];

  for (const trip of trips) {
    paymentHistory.push({ tripId: trip.trip_id, payment: trip.price });
    totalPayment = totalPayment + trip.price;
  }

  res.status(200).send(paymentHistory, { totalPayment: totalPayment });
});

profile.post("/getProfilePic", async (req, res) => {
  const { transanction_hash } = req.body;
  console.log(transanction_hash);
  const profile = await driverProfile
    .find({ transanction_hash: transanction_hash }, function (err, doc) {})
    .clone();
  const { profile_pic } = profile[0];
  res.status(200).send(profile_pic.url);
});

profile.post("/dailyCheckIn", async (req, res) => {
  const { transanction_hash, dailyCheck } = req.body;

  query = {
    transanction_hash: transanction_hash,
  };

  if (dailyCheck == true) {
    await driverProfile
      .findOneAndUpdate(query, { dailyCheck: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.status(200).send("Updated");
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  }
});

profile.get("/getDailyCheck", async (req, res) => {
  const { transanction_hash } = req.body;

  const profile = await driverProfile
    .find({ transanction_hash: transanction_hash }, function (err, doc) {})
    .clone();
  const { dailyCheck } = profile[0];
  console.log(profile);
  console.log(dailyCheck);
  return res.status(200).send({ dailyCheckIn: dailyCheck });
});

profile.post("/getStatus", async (req, res) => {
  const { transanction_hash } = req.body;

  query = {
    driver_id: transanction_hash,
  };

  driverLocation
    .findOne(await query, function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.status(200).send(doc.status);
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

module.exports = profile;
