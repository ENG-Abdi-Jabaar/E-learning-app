const Cart = require('../models/cartModel');

// Add a course to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, courses: [{ course: courseId }] });
    } else {
      // Check if course is already in cart
      const exists = cart.courses.some(c => c.course.toString() === courseId);
      if (exists) return res.status(400).json({ message: 'Course already in cart.' });

      cart.courses.push({ course: courseId });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('courses.course');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a course from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.courses = cart.courses.filter(c => c.course.toString() !== courseId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.courses = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};