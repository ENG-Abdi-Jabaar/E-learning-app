const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming you have a Course model
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  certificateUrl: {
    type: String, // URL to the generated certificate (if stored externally like in cloud storage)
    required: false
  }
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;