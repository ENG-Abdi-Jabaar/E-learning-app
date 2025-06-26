const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Add course to favorites
router.post('/add', favoriteController.addToFavorites);

// Remove course from favorites
router.post('/remove', favoriteController.removeFromFavorites);

// Get user's favorite list
router.get('/:userId', favoriteController.getFavorites);

module.exports = router;