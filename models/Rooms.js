const { getEvento } = require('../utils/gameLogic');
const Message = require('../models/Message');
const { aumentarPuntaje } = require('../controller/users');
class Room {
	constructor(host) {
		this.chat = [];
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
		this.chat.push(
			new Message(
				null,
				3,
				`${player.usuario} ha ingresado a la sala`
			)
		);
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
		const player_index = this.players.findIndex(
			(pl) => pl.uid == playerId
		);
		this.chat.push(
			new Message(
				null,
				3,
				`${this.players[player_index].usuario} se ha retirado de la sala`
			)
		);
		socket.to(roomId).emit('loadPlayersData', {
			chat: [...this.chat],
			players: [...this.players],
		});
		socket.leave(roomId);
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
		aumentarPuntaje(this.players[iplayer].uid);
	}
	saveMessage(message) {
		this.chat.push(message);
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
			return {
				players: [...room.players],
				chat: [...room.chat],
			};
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
		sendMessage: (roomId, usuario, playerNum, content) => {
			const room = rooms[roomId];
			const message = new Message(
				usuario,
				playerNum,
				content
			);
			room.saveMessage(message);
		},
	};
})();

module.exports = Rooms;
