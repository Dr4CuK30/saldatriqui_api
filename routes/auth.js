const { Router } = require('express');
const { check } = require('express-validator');
const { login, authToken, register } = require('../controller/auth');
const { validarToken } = require('../middlewares/validar-token');
const { validarCampos } = require('../middlewares/validations');

const router = Router();

router.post(
	'/login',
	[
		check('usuario', 'No ha ingresado ningun usuario')
			.not()
			.isEmpty(),
		check(
			'password',
			'No ha ingresado una contraseña valida'
		).isLength({
			min: 8,
		}),
		validarCampos,
	],
	login
);

router.post(
	'/register',
	[
		check('usuario', 'No ha ingresado ningun usuario')
			.not()
			.isEmpty(),
		check(
			'password',
			'No ha ingresado una contraseña valida'
		).isLength({
			min: 8,
		}),
		validarCampos,
	],
	register
);

router.get('/token', [validarToken], authToken);

module.exports = router;
