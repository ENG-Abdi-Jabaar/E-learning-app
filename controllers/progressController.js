// controllers/progressController.js
const Progress = require('../models/progressModel');
const Lesson = require('../models/lessonModel');

exports.markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [lessonId]
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    }

    // Check total lessons in this course
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progress.completedLessons.length;

    // If all lessons completed, mark course as complete
    if (completedCount === totalLessons) {
      progress.isCompleted = true;
    }

    progress.updatedAt = new Date();
    await progress.save();

    res.status(200).json({
      message: 'Lesson marked as completed',
      isCourseCompleted: progress.isCompleted,
      completedLessons: progress.completedLessons.length,
      totalLessons
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkCourseCompletion = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await Progress.findOne({ userId, courseId });

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completed = progress?.completedLessons.length || 0;
    const isCompleted = completed === totalLessons;

    res.status(200).json({
      courseId,
      totalLessons,
      completedLessons: completed,
      isCompleted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
