const wallet = require('express').Router();

const walletDetails = require('../models/walletDetails');

wallet.get("/" , async(req , res) => {
    res.send("Wallet here guys");
})

wallet.get

module.exports = wallet;