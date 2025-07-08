import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Only accept image files
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/upload
// Accepts multipart/form-data with a single image file under the "image" field
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }
  // Return the URL to access the uploaded image
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
