class Room {
	constructor(roomId) {
		this.players = [];
		this.inGame = false;
		this.isFull = false;
		this.host = null;
	}
	get isUseless() {
		if (this.players.length == 0 && this.inGame) return true;
		return false;
	}
	join(playerId, playername) {
		if (this.players.length < 2 && !this.inGame) {
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
	leave(playerId) {
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
		createRoom: (roomId) => {
			const room = new Room(roomId);
			rooms[roomId] = room;
		},
		joinRoom: (roomId, playerId) => {
			if (rooms[roomId]) return rooms[roomId].join(playerId);
			else {
				const room = new Room(roomId);
				rooms[roomId] = room;
				return rooms[roomId].join(playerId);
			}
		},
		leaveRoom: (roomId, playerId) => {
			rooms[roomId].leave(playerId);
			if (rooms[roomId].isUseless) delete rooms[roomId];
		},
	};
})();

module.exports = Rooms;
