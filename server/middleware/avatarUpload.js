// middleware/avatarUpload.js

const multer = require('multer');

const storage = multer.memoryStorage();


const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error('Only JPEG, PNG, and WebP images are allowed'),
      false
    );
  }

  cb(null, true);
};


const limits = {
  fileSize: 3 * 1024 * 1024 // 3MB
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;