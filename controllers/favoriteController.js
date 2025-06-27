const Favorite = require('../models/favoriteModel');

// Add a course to the user's favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if the user already has a favorite list
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      // If no favorite list exists for the user, create one
      favorite = new Favorite({
        userId,
        courses: [{ course: courseId }],
      });
    } else {
      // If the favorite list exists, check if the course is already added
      const exists = favorite.courses.some(
        (c) => c.course.toString() === courseId
      );

      if (exists) {
        return res.status(400).json({ message: 'Course already in favorites' });
      }

      // Add the course to the favorite list
      favorite.courses.push({ course: courseId });
    }

    // Save the favorite list
    await favorite.save();
    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a course from the user's favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Find the user's favorite list
    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite list not found' });
    }

    // Remove the course from the favorite list
    favorite.courses = favorite.courses.filter(
      (c) => c.course.toString() !== courseId
    );

    // Save the updated favorite list
    await favorite.save();
    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the user's favorite courses
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the favorite list for the user and populate the courses
    const favorite = await Favorite.findOne({ userId }).populate('courses.course');

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite list not found' });
    }

    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};