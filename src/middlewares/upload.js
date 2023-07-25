const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: "dbru1hnfl",
    api_key: "472416477342885",
    api_secret: "iUJH1gNxIw-kvnaPKTKL6XVsuI8",
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'book'
    }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
