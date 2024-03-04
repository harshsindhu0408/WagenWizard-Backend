const wss = require('./middleware/socket');
const server = require('./server');

server.listen(process.env.PORT || 8080 , () => {
    console.log('Server started on port 8080');
});

