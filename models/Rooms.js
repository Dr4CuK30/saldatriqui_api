const { getEvento } = require('../utils/gameLogic');

class Room {
	constructor(host) {
		this.players = [];
		this.inGame = false;
		this.isFull = false;
		this.host = host;
		this.turno = 3;
		this.gameTable = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
	}
	get isUseless() {
		if (this.players.length == 0) return true;
		return false;
	}
	join(socket, playerId, roomId) {
		if (this.players.length < 2 && !this.inGame) {
			socket.join(roomId);
			this.players.push(playerId);
			if (this.players.length == 2) {
				this.turno = 1;
				this.inGame = true;
				this.isFull = true;
			}
			return true;
		}
		return false;
	}
	leave(socket, roomId, playerId) {
		socket.leave(roomId);
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
				const room = new Room(playerName);
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
		moverCasilla: (roomId, f, c, pl) => {
			const room = rooms[roomId];
			room.gameTable[f][c] = pl;
			const evento = getEvento(room.gameTable);
			if (evento && evento.evento == 'empate') {
				console.log('lol');
				room.gameTable = room.gameTable.map((fila) => {
					return fila.map((pos) => 0);
				});
			}
			room.turno == 1 ? (room.turno = 2) : (room.turno = 1);
			return {
				tableroData: room.gameTable,
				turno: room.turno,
				evento,
			};
		},
		getRoomData: (roomId) => {
			const room = rooms[roomId];
			const evento = getEvento(room.gameTable);
			return {
				tableroData: room.gameTable,
				turno: room.turno,
				evento,
			};
		},
	};
})();

module.exports = Rooms;
