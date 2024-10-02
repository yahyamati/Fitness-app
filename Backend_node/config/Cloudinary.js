import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dskcvks89',
    api_key: '341414854685832',
    api_secret: 'ZYu7TTgBbrjk_LFUpthDoTuPDHA',
});

// Cloudinary storage configuration for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Exercise', // Optional: folder where videos will be stored
        resource_type: 'video' // Specify that we are expecting video files
    },
});

// Create a multer instance with file type filtering for videos only
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
        return cb(new Error('Invalid video file'), false);
    }
    cb(null, true);
};

// Configure multer with storage and file filter
const Exercise = multer({ storage: storage, fileFilter: fileFilter });

export { Exercise };
