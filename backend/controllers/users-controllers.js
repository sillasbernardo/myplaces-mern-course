/* Imports */
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
/* End */

/* ----------------------------------------------------------- */

/* User Functions */
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again.', 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};




const signup = async (req, res, next) => {
  // Check errors in req
  const error = validationResult(req);
  if (!error.isEmpty) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    name_register,
    username_register,
    email_register,
    password_register,
  } = req.body;

  // Check if user already exist
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email_register });
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError('User exists already, please login instead.', 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password_register, 12);
  } catch (error) {
    return next(new HttpError('Could not create user, please try again.', 500));
  }

  // Create new user model
  const createdUser = new User({
    name: name_register,
    username: username_register,
    image: req.file.path,
    email: email_register,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

  let token;
	try {
		token = jwt.sign(
			{
				userId: createdUser.id,
				email: createdUser.email,
			},
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		);
	} catch (error) {
		return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
	}

  res.status(201).json({ user: createdUser.id, email: createdUser.email, token: token });
};




const login = async (req, res, next) => {
  const { email_login, password_login } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email_login });
  } catch (error) {
    return next(
      new HttpError('Logging in failed, please try again later.', 500)
    );
  }

  if (!existingUser) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password_login,
      existingUser.password
    );
  } catch (error) {
    return next(
      new HttpError(
        'Could not log you in, please your credentials and try again.',
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  let token;
	try {
		token = jwt.sign(
			{
				userId: existingUser.id,
				email: existingUser.email,
			},
			'supersecret_dont_share',
			{ expiresIn: '1h' }
		);
	} catch (error) {
		return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
	}

  res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token
  });
};
/* End */

/* ----------------------------------------------------------- */

/* Exports */
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
/* End */
