const rooms = require('../models/Rooms');

const socketController = (io) => {
	let espera = null;
	io.on('connection', (socket) => {
		socket.on('cargarData', (payload) => {
			const { roomId } = payload;
			socket.join(roomId);
			socket.emit('cargarTablero', rooms.getRoomData(roomId));
		});
		socket.on('create', (payload) => {
			let { playerId, playerName } = payload;
			playerId = playerId.split('.')[1];
			const hasJoined = rooms.joinRoom(
				socket,
				playerId,
				playerId,
				playerName
			);
			socket.emit('hasJoined', { hasJoined });
		});
		socket.on('join', (payload) => {
			let { roomId, playerId, playerName } = payload;
			playerId = playerId.split('.')[1];
			rooms.joinRoom(socket, roomId, playerId, playerName);
			io.to(roomId).emit('start', {
				start: true,
				roomId,
			});
			socket.to(roomId).emit(
				'cargarTablero',
				rooms.getRoomData(roomId)
			);
		});
		socket.on('leave', (payload) => {
			console.log(payload);
			let { playerId, roomId } = payload;
			playerId = playerId.split('.')[1];
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
			io.to(roomId).emit('cargarTablero', gameData);
		});
	});
};

module.exports = {
	socketController,
};
