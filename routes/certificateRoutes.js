const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const Certificate = require('../models/certificateModel');

// 🔹 POST: Generate a certificate
router.post('/generate', certificateController.generateCertificate);

// 🔹 GET: Download certificate (if it exists)
router.get('/download/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Check if certificate exists in DB
    const cert = await Certificate.findOne({ userId, courseId });
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found in database' });
    }

    // Build file path
    const filePath = path.join(__dirname, '../certificates', `${userId}-${courseId}-certificate.pdf`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Certificate file not found on server' });
    }

    // Download the file
    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download certificate' });
  }
});

module.exports = router;
