class Room {
	constructor(roomId, host) {
		this.players = [];
		this.inGame = false;
		this.isFull = false;
		this.host = host;
	}
	get isUseless() {
		if (this.players.length == 0 && this.inGame) return true;
		return false;
	}
	join(socket, playerId, roomId) {
		if (this.players.length < 2 && !this.inGame) {
			socket.join(roomId);
			this.players.push(playerId);
			if (this.players.length == 2) {
				this.inGame = true;
				this.isFull = true;
			}
			return true;
		}
		return false;
	}
	leave(socket, roomId, playerId) {
		socket.leave(roomId);
		console.log(this.players);
		console.log(playerId);
		if (!this.players.includes(playerId)) return false;
		const player_index = this.players.findIndex(
			(pl) => pl == playerId
		);
		this.players.splice(player_index, 1);
		return true;
	}
}

const Rooms = (function () {
	var rooms = {};
	return {
		getRooms: () => rooms,
		joinRoom: (socket, roomId, playerId, playerName) => {
			if (rooms[roomId])
				return rooms[roomId].join(
					socket,
					playerId,
					roomId
				);
			else {
				const room = new Room(roomId, playerName);
				rooms[roomId] = room;
				return rooms[roomId].join(
					socket,
					playerId,
					roomId
				);
			}
		},
		leaveRoom: (socket, roomId, playerId) => {
			console.log(
				rooms[roomId].leave(socket, roomId, playerId)
			);
			if (rooms[roomId].isUseless) delete rooms[roomId];
		},
	};
})();

module.exports = Rooms;
