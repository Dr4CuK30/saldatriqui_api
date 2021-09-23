const rooms = require('./models/Rooms');
rooms.createRoom('2141dsa');
rooms.createRoom('2141dsa2');

require('dotenv').config();
const Server = require('./models/server');
const server = new Server();
server.listen();
