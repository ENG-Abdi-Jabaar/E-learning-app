// 📁 routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// ✅ Create a new course
router.post('/courses', courseController.createCourse);

// ✅ Get all courses
router.get('/courses', courseController.getAllCourses);

// ✅ Get a single course by ID
router.get('/courses/:id', courseController.getCourseById);

// ✅ Update a course by ID
router.put('/courses/:id', courseController.updateCourse);

// ✅ Delete a course by ID
router.delete('/courses/:id', courseController.deleteCourse);

module.exports = router;
