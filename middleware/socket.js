const { WebSocketServer } = require("ws");
const server = require('../server'); 
const wss = new WebSocketServer({ server  , path: "/updates"});

const driverLocation = require('../models/driverLocation');
const routeTaken = require('../models/route')

const updateTripLocation = async (trip_id , location , ws) => {
  const query = {
    'tripId' : trip_id
  }

  const route = routeTaken.findOne(query , function(err,doc) {
    if(err) ws.send(500 , {'error' : err})
  });

  if(route) {
    const { path } = route;
    path.push(location);
    var update = {
      'path' : path
    };
    routeTaken.findOneAndUpdate(query , update , function(err,doc) {
      if(err) return ws.send(501 , {'error' : err})
      return ws.send(JSON.stringify({'response_code' : 200 , 'response_status' : updated}));
    })
  } else {
    var newRoute = new routeTaken({
      'tripId' : trip_id,
      'path' : [location]
    })
    newRoute.save(function(err,doc) {
      if(err) return ws.send(500 , {'error' : err});
      return ws.send(200 , "updated")
    })
  }
}

const updateDriverLocation = async (driver_id, location , ws) => {
  console.log("updated driver location:", driver_id, location);
  //first find the driver
  //if driver exits,then update location otherwise insert new location
  const update = {
    'cordinates' : location
  };
  const query = {
    'driver_id' : driver_id
  };
  await driverLocation.findOneAndUpdate( query , update , function(err, doc) {
    if (err) return ws.send(500, {error: err});
    console.log(doc);
    return ws.send(JSON.stringify({'response_code' : 200 , 'response_status' : 'updated'}));  
}).clone().catch(function(err){ ws.send(JSON.stringify({'response_code' : 501 , 'response_status' : 'Server Error'}))});
  return true;
};

const updateDriverStatus = async (transanction_hash , status , ws) => {
  const query = {
    'driver_id' : transanction_hash
  }
  console.log(transanction_hash);

  const update = {
    'status' : status
  }

    await driverLocation.findOneAndUpdate( query , update , {upsert : true}, function(err, doc) {
      if (err) return ws.send(500, {error: err});
      console.log(doc);
      return ws.send(JSON.stringify({'response_code' : 200 , 'response_status' : 'updated'}));  
  }).clone().catch(function(err){ ws.send(JSON.stringify({'response_code' : 501 , 'response_status' : 'Server Error'}))});

}

wss.on("connection", function (ws) {
    
  ws.on("message", function (message) {

      msg = JSON.parse(message.toString());

      console.log(msg);
      
      if(msg.dataType == "new") {
        hash = msg.transanction_hash;
        ws.id = hash;
        const status = "online";
        updateDriverStatus(hash , status , ws); // hash is the driver id , hash is given to each ws connection
 
      }

      if(msg.dataType == "update") {
        update = msg.update;
        console.log(update);
        if(update == "exit") {
           const status = "offline";
           updateDriverStatus(ws.id , status , ws); // hash is the driver id , hash is given to each ws connection
           ws.close();
        } else if(update == "location") {
          driver_id = ws.id;        
          const location = msg.location;
          const [lat,lang] = location;
          console.log(hash,lat,lang);
          updateDriverLocation(driver_id, location , ws);
        }
        else if(update == "status") {
          const driver_id = ws.id;
          const status = msg.status;
          updateDriverStatus(driver_id , status , ws);
        } else if(update == "intriplocation") {
          const driver_id = ws.id;
          const location = msg.location;
          updateTripLocation(driver_id , location , ws);
        }
      }

      if(msg.dataType == "server") {
        const ip = ws._socket.remoteAddress
        
        const trip = msg.trip;
        const cordinates = trip.start.cordinates;
        const drivers =0 ;// function to compute drivers';
        const data = {
          "dataType" : "update",
          "update" : "trip",
          "trip" : trip
        };
        
        wss.clients.forEach(function each(client) {
          if(client.id in drivers) {
            client.send(data);
          }
      });
      }

      if(msg.dataType == "workshop") {
        
      }


  });


});
