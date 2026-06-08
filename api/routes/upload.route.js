import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'api/uploads/');
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

  const mimeType = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

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
    fileSize: 80 * 1024 * 1024, // 80MB max
  },
});

router.post('/single', upload.single('file'), (req, res) => {
  console.log('UPLOAD ROUTE HIT');
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
  });
});

export default router;