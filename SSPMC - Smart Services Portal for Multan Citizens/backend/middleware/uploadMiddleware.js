import multer from 'multer';

const storage = multer.memoryStorage();

const fileTypeFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid asset specification. Only image mime streams are permitted.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter: fileTypeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});