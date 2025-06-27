const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create a new category
router.post('/create', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get courses by category
router.get('/courses/:categoryId', categoryController.getCoursesByCategory);

module.exports = router;