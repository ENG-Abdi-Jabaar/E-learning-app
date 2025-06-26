



const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/certificateModel');

// Generate a certificate for a user who completed a course
exports.generateCertificate = async (req, res) => {
  try {
    const { userId, courseId, userName, courseName } = req.body;

    // Generate a file path for the certificate
    const certificateFileName = `${userId}-${courseId}-certificate.pdf`;
    const certificateDir = path.join(__dirname, '../certificates');
    const certificateFilePath = path.join(certificateDir, certificateFileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(certificateDir)) {
      fs.mkdirSync(certificateDir);
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the document to a writable stream
    const writeStream = fs.createWriteStream(certificateFilePath);
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(userName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('has successfully completed the course:', { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(courseName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    // Finalize the PDF and save it
    doc.end();

    // Wait until PDF is fully written before saving to DB and sending response
    writeStream.on('finish', async () => {
      const newCertificate = new Certificate({
        userId,
        courseId,
        issuedAt: new Date(),
        certificateUrl: `/certificates/${certificateFileName}`
      });

      await newCertificate.save();

      // Send the file for download
      res.download(certificateFilePath, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Error sending certificate' });
        } else {
          console.log('Certificate downloaded successfully');
        }
      });
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
