const { Router } = require('express');
const { get10MejoresPuntajes } = require('../controller/users');

const router = Router();

router.get('/', get10MejoresPuntajes);

module.exports = router;
