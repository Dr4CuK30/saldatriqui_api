const { response } = require('express');
const { request } = require('http');
const rooms = require('../models/Rooms');

const getAllRooms = (req = request, res = response) => {
	res.send(rooms.getRooms());
};

module.exports = {
	getAllRooms,
};
