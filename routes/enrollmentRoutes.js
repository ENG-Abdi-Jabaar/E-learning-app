const express = require('express');
const router = express.Router();
const { enrollUser } = require('../controllers/enrollmentController');

router.post('/enroll', enrollUser);

module.exports = router;
