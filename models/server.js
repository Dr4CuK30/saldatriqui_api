const express = require('express');
const cors = require('cors');
const dbConnection = require('../db/dbconfig');
const { socketController } = require('../controller/socketController');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);
		this.dbConnect();
		this.middlewares();
		this.routes();
		this.sockets();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
	}

	routes() {
		this.app.use('/api/auth', require('../routes/auth'));
		this.app.use('/api/rooms', require('../routes/rooms'));
		this.app.use('/api/users', require('../routes/users'));
	}

	sockets() {
		socketController(this.io);
	}

	async dbConnect() {
		await dbConnection();
	}

	listen() {
		this.server.listen(process.env.PORT, () => {
			console.log(
				'Aplicacion Funcionando en puerto: ' +
					process.env.PORT
			);
		});
	}
}

module.exports = Server;
