const Order = require('../models/orderModel');
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel'); // 👈 Make sure the path is correct


// Create a new order

// ✅ Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, courses } = req.body;

    let totalAmount = 0;
    const courseDetails = [];

    for (const item of courses) {
      const course = await Course.findById(item.course);
      if (!course) {
        return res.status(404).json({ message: `Course not found: ${item.course}` });
      }

      // ❌ Prevent duplicate if already enrolled
      const alreadyEnrolled = await Enrollment.findOne({
        userId,
        courseId: course._id,
      });

      if (alreadyEnrolled) {
        return res.status(400).json({ message: `Already enrolled in ${course.title}` });
      }

      // ❌ Prevent duplicate if already ordered (pending or paid)
      const existingOrder = await Order.findOne({
        userId,
        'courses.course': course._id,
        status: { $in: ['pending', 'paid'] },
      });

      if (existingOrder) {
        return res.status(400).json({ message: `You already have an order for ${course.title}` });
      }

      // ✅ Include in new order
      totalAmount += course.price;
      courseDetails.push({
        course: course._id,
        price: course.price,
      });
    }

    const order = await Order.create({
      userId,
      courses: courseDetails,
      totalAmount,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate('courses.course');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('courses.course');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update order status + auto-enroll user in paid courses
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 🧠 Auto-enroll the user in purchased courses when payment is complete
    if (status === 'paid') {
      for (const item of order.courses) {
        const exists = await Enrollment.findOne({
          userId: order.userId,
          courseId: item.course
        });

        if (!exists) {
          await Enrollment.create({
            userId: order.userId,
            courseId: item.course
          });
        }
      }
    }

    res.status(200).json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
