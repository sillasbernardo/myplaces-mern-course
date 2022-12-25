const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placeRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

mongoose.set('strictQuery', true);

/* Middleware */
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, X-Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
	next();
})

app.use('/api/places',placeRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (req.file){
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}

	if (res.headerSent){
		return next(error);
	}
	res.status(error.code || 500);
	res.json({message: error.message || 'An unkown error ocurred!'})
})

mongoose
	.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pczvzsn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
	.then(() => {
		app.listen(process.env.PORT || 5000);
	})
	.catch(err => console.log(err));