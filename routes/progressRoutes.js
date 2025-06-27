// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/mark-complete', progressController.markLessonComplete);
router.get('/check-completion/:userId/:courseId', progressController.checkCourseCompletion);

module.exports = router;
