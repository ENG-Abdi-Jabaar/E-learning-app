const { initiateWaafiPayment } = require('../services/waafiService');
const User = require('../models/User');
const Order = require('../models/orderModel');
const Enrollment = require('../models/enrollmentModel');

exports.payWithWaafi = async (req, res) => {
  try {
    const { userId, orderId, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Order already paid.' });
    }

    const amount = order.totalAmount;
    const payerPhone = phone || user.phone;
    const referenceId = `REF-${Date.now()}`;
    const invoiceId = `INV-${order._id}`;
    const description = `Payment for ${order.courses.length} course(s)`;

    const paymentResult = await initiateWaafiPayment({
      accountNo: payerPhone,
      amount,
      referenceId,
      invoiceId,
      description
    });

    if (paymentResult?.responseCode === '2001') {
      order.status = 'paid';
      await order.save();

      for (const item of order.courses) {
        const exists = await Enrollment.findOne({ userId, courseId: item.course });
        if (!exists) {
          await Enrollment.create({ userId, courseId: item.course });
        }
      }

      return res.status(200).json({
        message: 'Payment successful & enrolled',
        phoneUsed: payerPhone,
        amount,
        paymentResult
      });
    } else {
      return res.status(400).json({
        message: 'Payment failed',
        phoneUsed: payerPhone,
        amount,
        paymentResult
      });
    }
  } catch (error) {
    console.error('Waafi Payment Error:', error);
    res.status(500).json({ error: error.message });
  }
};
