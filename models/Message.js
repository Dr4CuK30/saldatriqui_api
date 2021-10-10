class Message {
	constructor(usuario, playerNum, content) {
		this.usuario = usuario;
		this.playerNum = playerNum;
		this.content = content;
		this.date = Date.now();
	}
}

module.exports = Message;
