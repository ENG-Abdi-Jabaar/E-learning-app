const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const upload = require('../middlewares/upload'); // ✅ Import the multer middleware

// ✅ Create lesson with video upload
router.post('/', upload.single('video'), lessonController.createLesson);

// ✅ Get all lessons by course ID
router.get('/course/:courseId', lessonController.getLessonsByCourse);

// ✅ Get a single lesson by ID
router.get('/:id', lessonController.getLessonById);

// ✅ Update lesson (optional: add upload.single if video update is needed)
router.put('/:id', lessonController.updateLesson);

// ✅ Delete lesson
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
