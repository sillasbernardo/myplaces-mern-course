/* Import session */
const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

/* Main code */
const router = express.Router();

// Get all users
router.get('/', usersControllers.getUsers);

// Create a new user
router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name_register').not().isEmpty(),
		check('username_register').not().isEmpty(),
		check('email_register').normalizeEmail().isEmail(),
		check('password_register').isLength({ min: 8 })
	], 
	usersControllers.signup);

// Log user in
router.post('/login', usersControllers.login);

module.exports = router;
