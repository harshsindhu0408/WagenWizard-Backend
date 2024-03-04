const workshop = require('express').Router();

const tripRouter = require('./trip');
const loginRouter = require("./login");
const profileRouter = require("./Profile");

workshop.use("/trip", tripRouter);
workshop.use("/login", loginRouter);
workshop.use("/profile", profileRouter);


module.exports = workshop;
