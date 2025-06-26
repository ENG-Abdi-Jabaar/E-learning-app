const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add course to cart
router.post('/add', cartController.addToCart);

// Get user's cart
router.get('/:userId', cartController.getCart);

// Remove a course from cart
router.post('/remove', cartController.removeFromCart);

// Clear the cart
router.post('/clear', cartController.clearCart);

module.exports = router;