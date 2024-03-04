const { WebSocketServer } = require("ws");
const server = require("../../server");
const wss = new WebSocketServer({ server });
const locationmodel = require("../../models/driverLocation");

/** 
 *
 * @param {WebSocket} ws
 * @param {*} req
 */
// const handleConnection = (ws, req) => {
//   console.log("handling connection", req);

// };

// wss.on("connection", handleConnection);
let driver_id = null;

wss.on("connection", function (ws) {
  // console.log("new connection");
  ws.on("message", function (message) {
    const msg = JSON.parse(message.toString());

    console.log(msg);

    if (msg.dataType == "new") {
      ws.id = msg.transanction_hash;
      driver_id = msg.driver_id;
      console.log("new request received");
      ws.send("location");
    }

    if (msg.dataType == "update") {
      update = msg.update;
      console.log(update);
      if (update == "exit") {
        ws.close();
      } else if (update === "location") {
        const location = msg.location;
        
      }
    }

    if (msg.dataType == "server") {
      const ip = ws._socket.remoteAddress;
      ws.send(ip);
    }
  });
});
