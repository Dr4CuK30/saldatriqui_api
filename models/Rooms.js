const { getEvento } = require('../utils/gameLogic');

class Room {
	constructor(host) {
		this.players = [];
		this.esperaReinicio = [];
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
	join(socket, player, roomId) {
		if (this.players.length < 2 && !this.inGame) {
			socket.join(roomId);
			this.players.push(player);
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
		const player_index = this.players.findIndex(
			(pl) => pl.uid == playerId
		);
		this.players.splice(player_index, 1);
	}
	reiniciarTablero() {
		this.gameTable = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
	}
	sumarPuntuacion(playerNum) {
		const iplayer = this.players.findIndex(
			(pl) => pl.playerNum == playerNum
		);
		this.players[iplayer].puntuacion += 1;
	}
}

const Rooms = (function () {
	var rooms = {};
	return {
		getRooms: () => rooms,
		joinRoom: (socket, roomId, player) => {
			if (rooms[roomId])
				return rooms[roomId].join(
					socket,
					player,
					roomId
				);
			else {
				const room = new Room(player.usuario);
				rooms[roomId] = room;
				return rooms[roomId].join(
					socket,
					player,
					roomId
				);
			}
		},
		leaveRoom: (socket, roomId, playerId) => {
			rooms[roomId].leave(socket, roomId, playerId);
			if (rooms[roomId].isUseless) delete rooms[roomId];
		},
		moverCasilla: (roomId, f, c, pl) => {
			const room = rooms[roomId];
			room.gameTable[f][c] = pl;
			const evento = getEvento(room.gameTable);
			if (evento && evento.evento == 'hayGanador') {
				room.sumarPuntuacion(evento.ganadorData.winner);
			}
			if (evento && evento.evento == 'empate') {
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
		getPlayersData: (roomId) => {
			const room = rooms[roomId];
			return [...room.players];
		},
		reiniciarJuego: (io, roomId, playerId) => {
			const room = rooms[roomId];
			room.esperaReinicio.push(playerId);
			if (room.esperaReinicio.length == 2) {
				room.esperaReinicio = [];
				const evento = getEvento(room.gameTable);
				if (evento.ganadorData.winner == 1) {
					room.turno = 2;
				} else {
					room.turno = 1;
				}
				room.reiniciarTablero();
				io.to(roomId).emit('cargarTablero', {
					tableroData: room.gameTable,
					turno: room.turno,
					evento: null,
				});
			}
		},
	};
})();

module.exports = Rooms;
