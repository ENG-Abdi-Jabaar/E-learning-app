const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/waafi', paymentController.payWithWaafi); // 👈 POST /api/payment/waafi

module.exports = router;
