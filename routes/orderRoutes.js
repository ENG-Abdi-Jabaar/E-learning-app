const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', orderController.createOrder);

// Get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (e.g., to 'paid')
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;