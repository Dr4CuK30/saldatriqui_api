const User = require('../models/user');
const axios = require('axios');
const { request, response } = require('express');

const functionalUrl = `${process.env.FUNCTIONAL_API_URL}:${process.env.FUNCTIONAL_API_PORT}`;

const aumentarPuntaje = async (uid) => {
	try {
		const user = await User.findById(uid);
		user.max_score++;
		user.save();
	} catch (e) {
		console.error(e);
	}
};

const get10MejoresPuntajes = async (req = request, res = response) => {
	try {
		const users = await User.find().limit(10);
		const mappedData = users.map((user) => {
			const { usuario, max_score } = user;
			return { usuario, max_score };
		});
		const { data } = await axios.post(functionalUrl, mappedData);
		res.send(data.data);
	} catch (e) {
		console.error(e);
		res.status(500).send(e);
	}
};

module.exports = {
	aumentarPuntaje,
	get10MejoresPuntajes,
};
