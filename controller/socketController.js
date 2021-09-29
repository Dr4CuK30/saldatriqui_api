const rooms = require('../models/Rooms');

const socketController = (io) => {
	let espera = null;
	io.on('connection', (socket) => {
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
			const hasJoined = rooms.joinRoom(
				socket,
				roomId,
				playerId,
				playerName
			);
			socket.emit('hasJoined', { hasJoined });
			if (hasJoined) {
				io.to(roomId).emit('start', {
					start: true,
					roomId,
				});
			} else {
				socket.emit('hasJoined', { hasJoined });
			}
			console.log(rooms.getRooms());
		});
		socket.on('leave', (payload) => {
			console.log(payload);
			let { playerId, roomId } = payload;
			playerId = playerId.split('.')[1];
			rooms.leaveRoom(socket, roomId, playerId);
		});
		socket.on('mover', (payload) => {
			const { roomId, ...moveData } = payload;
			socket.to(roomId).emit('cargarTablero', moveData);
		});
		socket.on('disconnect', () => {
			console.log('desconectado');
		});
	});
};

module.exports = {
	socketController,
};
