import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'api/uploads';

// Create the uploads folder automatically if it does not exist.
// This fixes Render's "ENOENT: no such file or directory" error.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|mp4|mov|avi|mkv/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType =
    file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 80 * 1024 * 1024,
  },
});

router.post('/single', upload.single('file'), (req, res) => {
  console.log('UPLOAD ROUTE HIT');
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Use a relative URL so it works on both localhost and Render.
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
  });
});

export default router;