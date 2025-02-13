import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory instead of disk

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit size to 100MB
});
