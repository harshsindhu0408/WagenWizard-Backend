
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const morgan = require('morgan');
const dotenv = require('dotenv').config()
require('./db/connect');
const app = express();
app.use(helmet());
app.use(cors());
// adding morgan to log HTTP requests
// app.use(morgan('combined'));

const bodyParser = require('body-parser')
const { admin , adminRouter } = require('./adminModules/adminbro');

app.use(admin.options.rootPath , adminRouter);


app.use(bodyParser.json({
  limit : '50mb',
  extended : true,
}));
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb' , parameterLimit:50000}));

const driverRouter = require('./driverModules/driver');
// const adminRouter = require('./adminModules/admin');
const workshopRouter = require('./workshopModules/workshop');


// heroku_port=process.env.PORT;
// console.log(heroku_port);
const PORT = process.env.PORT || 8080;

const ORIGIN=process.env.ORIGIN || `http://localhost:${PORT}`;
// console.log(PORT ,ORIGIN)

app.use('/driver' , driverRouter);
app.use('/admin' , adminRouter);
app.use('/workshop' , workshopRouter);
// app.use(express.json());



app.get('/' , (req, res) => {
  // console.log('1');
  res.status(200).send('<h1>Hey Nigga,  go and do some work</h1>')
  // console.log(req.body);
});

module.exports = app;