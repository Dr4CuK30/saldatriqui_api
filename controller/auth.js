const { response, request } = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');

const login = async (req = request, res = response) => {
	const datos = req.body;
	try {
		const usuariox = await Usuario.findOne({
			usuario: datos.usuario.toLowerCase(),
		});
		if (!usuariox) {
			res.status(400).json({
				msg: 'Este usuario no existe',
			});
		}
		if (!bcrypt.compareSync(datos.password, usuariox.password)) {
			res.status(400).json({
				msg: 'Contraseña invalida',
			});
		}
		const token = await generarJWT(usuariox.id);
		res.json({
			usuariox,
			token,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error: 'Error inesperado',
			msg: e,
		});
	}
};

const authToken = async (req = request, res = response) => {
	const usuario = await Usuario.findById(req.body.userData.uid);
	res.status(200).json({ usuariox: usuario.toJSON() });
};

const register = async (req = request, res = response) => {
	let { usuario, password } = req.body;
	usuario = usuario.toLowerCase();
	const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);
	userData = {
		usuario,
		password,
		friends: [],
		max_score: 0,
	};
	const usuarioI = new Usuario(userData);
	try {
		await usuarioI.save();
	} catch (e) {
		return res.status(400).json({ error: 'Error Inesperado F' });
	}
	res.json(usuarioI);
};

module.exports = {
	login,
	authToken,
	register,
};
