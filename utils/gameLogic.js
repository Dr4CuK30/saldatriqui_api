const getEvento = (table) => {
	const ganadorData = getWinner(table);
	if (ganadorData) return { evento: 'hayGanador', ganadorData };
	if (tableIsFull(table)) return { evento: 'empate' };
	return null;
};

const tableIsFull = (table) => {
	let isfull = true;
	table.forEach((fila) => {
		if (fila.includes(0)) isfull = false;
	});
	return isfull;
};

const getWinner = (table) => {
	let winnerData = null;
	for (const [i, fila] of table.entries()) {
		// GANA POR FILA
		if (fila[0] != 0 && fila[0] == fila[1] && fila[1] == fila[2]) {
			winnerData = {
				winner: fila[0],
				casillas: [
					[i, 0],
					[i, 1],
					[i, 2],
				],
			};
		}
		// GANA POR COLUMNA
		if (
			table[0][i] != 0 &&
			table[0][i] == table[1][i] &&
			table[0][i] == table[2][i]
		) {
			winnerData = {
				winner: table[0][i],
				casillas: [
					[0, i],
					[1, i],
					[2, i],
				],
			};
		}
	}
	//GANA POR DIAGONALES
	if (
		table[0][0] != 0 &&
		table[0][0] == table[1][1] &&
		table[0][0] == table[2][2]
	) {
		winnerData = {
			winner: table[0][0],
			casillas: [
				[0, 0],
				[1, 1],
				[2, 2],
			],
		};
	}
	if (
		table[0][2] != 0 &&
		table[0][2] == table[1][1] &&
		table[0][2] == table[2][0]
	) {
		winnerData = {
			winner: table[0][2],
			casillas: [
				[0, 2],
				[1, 1],
				[2, 0],
			],
		};
	}
	return winnerData;
};

module.exports = {
	getEvento,
};
