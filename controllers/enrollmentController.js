const Enrollment = require('../models/enrollmentModel');

exports.enrollUser = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    res.status(201).json({
      message: 'User successfully enrolled',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
