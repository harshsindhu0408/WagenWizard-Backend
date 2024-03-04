const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');
const AdminJSExpress = require('@adminjs/express');

const Admin = require('../models/admin');
const Workshop = require('../models/workshopProfile');
const TripDetails = require('../models/tripDetails');
const Driver = require('../models/driverProfile');
const mongoose=require('mongoose');
AdminJS.registerAdapter(AdminJSMongoose);
const DEFAULT_ADMIN = {
    email: "admin@example.com",
    password: "password",
  };
  
  const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
  };
const admin = new AdminJS({
  databases: [mongoose],
// resources: AdminJSMongoose.buildResources([DriverModel]),
//   resources: [{
//     resource: DriverModel,
//     options: {
//         parent:{
//             name:'Drivers'
//         }
//     }
//   }],
  branding: {
    companyName: "Wagen Wizard",
    logo: false,
  },
  rootPath: "/admin",
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: "sessionsecret",
  },
  null,
  {
    // store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: "sessionsecret",
    cookie: {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    },
    name: "Wagen Wizard",
  }
);

module.exports = { admin , adminRouter };
