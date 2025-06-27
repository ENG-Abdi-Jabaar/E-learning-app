const Progress = require('../models/progressModel');
const Lesson = require('../models/lessonModel');
const Certificate = require('../models/certificateModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, lessonId, userName, courseName } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [lessonId]
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    }

    // Count lessons
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progress.completedLessons.length;

    // Mark course as complete
    if (completedCount === totalLessons) {
      progress.isCompleted = true;

      // ✅ Check if certificate already exists
      const certExists = await Certificate.findOne({ userId, courseId });
      if (!certExists) {
        const certificateFileName = `${userId}-${courseId}-certificate.pdf`;
        const certificateDir = path.join(__dirname, '../certificates');
        const certificateFilePath = path.join(certificateDir, certificateFileName);

        // Create directory if it doesn't exist
        if (!fs.existsSync(certificateDir)) {
          fs.mkdirSync(certificateDir);
        }

        // Generate certificate
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(certificateFilePath);
        doc.pipe(writeStream);

        doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text('This is to certify that', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(userName || 'User', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text('has successfully completed the course:', { align: 'center' });
        doc.moveDown();
        doc.fontSize(22).text(courseName || 'Course', { align: 'center' });
        doc.moveDown();
        doc.fontSize(15).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();

        // Save certificate after writing
        writeStream.on('finish', async () => {
          await Certificate.create({
            userId,
            courseId,
            issuedAt: new Date(),
            certificateUrl: `/certificates/${certificateFileName}`
          });
        });
      }
    }

    progress.updatedAt = new Date();
    await progress.save();

    res.status(200).json({
      message: 'Lesson marked as completed',
      isCourseCompleted: progress.isCompleted,
      completedLessons: completedCount,
      totalLessons
    });

  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: error.message });
  }
};
