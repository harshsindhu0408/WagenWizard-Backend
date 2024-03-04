const app = require('./app');
const bodyParser = require('body-parser');

app.use(bodyParser.json({
    limit : '50mb'
}));

app.use(bodyParser.urlencoded({ extended: false , limit: '50mb' , parameterLimit:50000}));

const http = require('http');
const server = http.createServer(app);
module.exports = server;