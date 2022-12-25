/* Imports */
const fs = require('fs');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
/* end */

/* CRUD Functions */
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};
/* ---- */
const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not load places.',
      500
    );
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};
/* ---- */
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find places for this user.',
      500
    );
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};
/* ---- */
const createPlace = async (req, res, next) => {
  // Check for req invalid data
  const error = validationResult(req);
  if (!error.isEmpty) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  // Get coordinates from google api using address
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // Create new Place model
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  });

  // Check if user (the creator) exists
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id.', 404));
  }

  try {
    // Try pushing the new place to user's place array, if it failed, none of it will have saved
    // Session and transaction run separetely from the main code flow
    const sess = await mongoose.startSession(); // Start new session in new code "dimension"
    sess.startTransaction();
    await createdPlace.save({ session: sess }); // Wait until code below is sucessful and save data to db
    user.places.push(createdPlace); // Push created place to user's place array, if this is sucessful, the above code runs
    await user.save({ session: sess }); // If code above is sucessfull, this will run as well
    await sess.commitTransaction(); // If everything is ok, this runs and the whole process is sent to db
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};
/* ---- */
const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  }

	// Check if user is creator
	if (place.creator.toString() !== req.userData.userId){
		return next(
      new HttpError('You are not allowed to edit this place.', 403)
    );
	}

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
/* ---- */
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not remove place', 500)
    );
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id', 404));
  }

	if (place.creator.id !== req.userData.userId){
		return next(
      new HttpError('You are not allowed to delete this place.', 403)
    );
	}

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not remove place', 500)
    );
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};
/* End */

// ----------------------------------------------------

/* Exports */
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
exports.getAllPlaces = getAllPlaces;
/* end */
