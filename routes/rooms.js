const { Router } = require('express');
const { getAllRooms } = require('../controller/rooms');

const router = Router();

router.get('/', getAllRooms);

module.exports = router;
