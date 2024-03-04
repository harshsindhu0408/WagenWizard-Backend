const AWS = require('./middleware/aws');
const s3 = new AWS.S3();
const route = new AWS.Location({region: "ap-southeast-1"} );
const reply = route.calculateRoute({
    "Calculator" : "wagenwizard",
    "DeparturePosition": [-122.7565,49.0021],
    "DestinationPosition": [-122.3394, 47.6159]
})


console.log(reply.response);