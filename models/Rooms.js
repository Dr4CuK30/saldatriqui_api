class Room {
	constructor(roomId, host) {
		this.players = [];
		this.inGame = false;
		this.isFull = false;
		this.host = null;
	}
	get isUseless() {
		if (this.players.length == 0 && this.inGame) return true;
		return false;
	}
	join(socket, playerId, playername) {
		if (this.players.length < 2 && !this.inGame) {
			socket.join(playerId);
			if (this.players.length == 0) this.host = playername;
			this.players.push(playerId);
			if (this.players.length == 2) {
				this.inGame = true;
				this.isFull = true;
			}
			return true;
		}
		return false;
	}
	leave(playId) {
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
				return rooms[roomId].join(socket, playerId);
			else {
				const room = new Room(roomId);
				rooms[roomId] = room;
				return rooms[roomId].join(
					socket,
					playerId,
					playerName
				);
			}
		},
		leaveRoom: (roomId, playerId) => {
			rooms[roomId].leave(playerId);
			if (rooms[roomId].isUseless) delete rooms[roomId];
		},
	};
})();

module.exports = Rooms;
