const admin = require('express').Router();

const newUserRouter = require('./createUser');

admin.use('/newUser' , newUserRouter);

module.exports = admin;