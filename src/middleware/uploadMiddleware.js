import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder automatically
const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4",
    "video/mov",
    "video/quicktime",
    "video/webm",
    "video/x-matroska",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

export default upload;