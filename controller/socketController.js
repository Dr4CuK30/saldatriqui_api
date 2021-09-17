const socketController = (socket, io) => {
	console.log('Conectado');
	socket.on('search', (payload) => {
		console.log(payload);
		socket.join('room 1');
		socket.to('room 1').emit('encontro');
	});
};

module.exports = {
	socketController,
};
