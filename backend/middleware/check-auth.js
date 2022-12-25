const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

	if (req.method === 'OPTIONS'){
		return next();
	}

	try {
		const token = req.headers.authorization.slice(6);
		console.log(token)
		if (!token){
			throw new Error('Authentication failed!');
		}

		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		req.userData = {
			userId: decodedToken.userId
		}
		next();
	} catch (error) {
		return next(new HttpError('Authentication failed!', 401));		
	}

}