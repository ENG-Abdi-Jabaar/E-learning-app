const Category = require('../models/categoryModel');
const Course = require('../models/courseModel');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      description,
    });

    // Save the category to the database
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses by category
exports.getCoursesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find all courses under the specific category
    const courses = await Course.find({ category: categoryId }).populate('category');
    
    // Check if courses exist in this category
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this category' });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};