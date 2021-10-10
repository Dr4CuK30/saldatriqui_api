const rooms = require('../models/Rooms');

const socketController = (io) => {
	let espera = null;
	io.on('connection', (socket) => {
		socket.on('cargarData', (payload) => {
			const { roomId } = payload;
			socket.join(roomId);
			socket.emit('cargarTablero', rooms.getRoomData(roomId));
			socket.emit(
				'loadPlayersData',
				rooms.getPlayersData(roomId)
			);
		});
		socket.on('create', (payload) => {
			let { playerId, player } = payload;
			playerId = playerId.split('.')[1];
			player.playerNum = 1;
			player.puntuacion = 0;
			rooms.joinRoom(socket, playerId, player);
		});
		socket.on('join', (payload) => {
			let { roomId, player } = payload;
			player.playerNum = 2;
			player.puntuacion = 0;
			rooms.joinRoom(socket, roomId, player);
			io.to(roomId).emit('start', {
				start: true,
				roomId,
			});
			socket.to(roomId).emit(
				'cargarTablero',
				rooms.getRoomData(roomId)
			);
			socket.to(roomId).emit(
				'loadPlayersData',
				rooms.getPlayersData(roomId)
			);
		});
		socket.on('leave', (payload) => {
			let { playerId, roomId } = payload;
			rooms.leaveRoom(socket, roomId, playerId);
		});
		socket.on('mover', (payload) => {
			const { roomId, f, c, player } = payload;
			const gameData = rooms.moverCasilla(
				roomId,
				f,
				c,
				player
			);
			if (
				gameData.evento &&
				gameData.evento.evento == 'hayGanador'
			)
				io.to(roomId).emit(
					'loadPlayersData',
					rooms.getPlayersData(roomId)
				);
			io.to(roomId).emit('cargarTablero', gameData);
		});
		socket.on('reiniciar', (payload) => {
			const { roomId, playerId } = payload;
			rooms.reiniciarJuego(io, roomId, playerId);
		});
		socket.on('enviarMensaje', (payload) => {
			const { usuario, playerNum, content, roomId } = payload;
			rooms.sendMessage(roomId, usuario, playerNum, content);
			io.to(roomId).emit(
				'loadPlayersData',
				rooms.getPlayersData(roomId)
			);
		});
	});
};

module.exports = {
	socketController,
};
