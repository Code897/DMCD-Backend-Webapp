import multer from 'multer';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Middleware to handle single file upload; field name is 'image'
export const imageUpload = upload.single('image');