const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = require('../config')

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

module.exports = (req, res, next) => {
  req.cloudinary = cloudinary;
  next();
};
