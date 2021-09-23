const express = require('express');
const cors = require('cors');
const dbConnection = require('../db/dbconfig');

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
	}

	sockets() {
		let espera = null;
		this.io.on('connection', (socket) => {
			socket.on('search', (payload) => {
				let roomId;
				payload = payload.split('.')[1];
				if (!espera) {
					roomId = payload;
					espera = payload;
				} else {
					roomId = espera;
					espera = null;
				}
				socket.join(roomId);
				if (espera == null) {
					this.io
						.to(roomId)
						.emit('empezar', roomId);
				}
			});
			socket.on('mover', (payload) => {
				const { roomId, ...moveData } = payload;
				socket.to(roomId).emit(
					'cargarTablero',
					moveData
				);
			});
			socket.on('disconnect', () => {
				console.log('desconectado');
			});
		});
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
