const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Route to generate a certificate
router.post('/generate', certificateController.generateCertificate);

module.exports = router;