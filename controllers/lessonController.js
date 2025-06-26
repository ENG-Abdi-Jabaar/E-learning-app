const Lesson = require('../models/lessonModel');

// ✅ Create Lesson with video upload
exports.createLesson = async (req, res) => {
  try {
    const { courseId, title, duration } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ message: 'No video uploaded.' });
    }

    const newLesson = new Lesson({
      courseId,
      title,
      duration,
      videoUrl: `/uploads/${videoFile.filename}`  // 📁 Store path to access video
    });

    await newLesson.save();
    res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all lessons for a course
exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update lesson (without video change)
exports.updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
