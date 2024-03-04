const driver = require('express').Router();

const loginRouter = require('./login');
const pickupRouter = require('./pickup');
const profileRouter = require('./profile');
const walletRouter = require('./wallet');

driver.use('/authenticate' , loginRouter);
driver.use('/profile' , profileRouter);
driver.use('/pickup' , pickupRouter);
driver.use('/wallet' , walletRouter)

module.exports = driver;

