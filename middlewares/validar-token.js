const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validarToken = (req = request, res = response, next) => {
	const token = req.header('tokenx');
	if (!token) {
		res.status(401).json({
			msg: 'No ha ingresado un JWT',
		});
	}
	try {
		const x = jwt.verify(
			req.header('tokenx'),
			process.env.JWTSECRETKEY
		);
		next();
	} catch (e) {
		res.status(401).json({
			msg: 'JWT invalido',
		});
	}
};

module.exports = { validarToken };
