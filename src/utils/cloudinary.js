const cloudinary = require('cloudinary').v2;
const fs = require('fs')
cloudinary.config({
    cloud_name: "dbru1hnfl",
    api_key: "472416477342885",
    api_secret: "iUJH1gNxIw-kvnaPKTKL6XVsuI8",
});
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}
module.exports = { removeTmp, cloudinary };
