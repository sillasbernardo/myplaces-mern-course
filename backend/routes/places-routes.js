const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const placesController = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

/* Get all places */
router.get('/', placesController.getAllPlaces);

/* Get place by place id */
router.get('/:pid', placesController.getPlaceById);

/* Get places by user id */
router.get('/user/:uid', placesController.getPlacesByUserId);

router.use(checkAuth);

/* Post a new place */
router.post(
	'/',
	fileUpload.single('image'),
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5}),
		check('address').not().isEmpty()
	], 
	placesController.createPlace);

/* Update an existing place */
router.patch(
	'/:pid',
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 })
	],
	placesController.updatePlaceById);

/* Delete an existing place */
router.delete('/:pid', placesController.deletePlace);

module.exports = router;