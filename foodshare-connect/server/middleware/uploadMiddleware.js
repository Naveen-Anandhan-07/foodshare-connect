const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsFolder = path.join(
  __dirname,
  "..",
  "uploads"
);

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadsFolder);
  },

  filename: function (req, file, callback) {
    const extension = path.extname(
      file.originalname
    );

    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      extension;

    callback(null, fileName);
  },
});

function fileFilter(req, file, callback) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only JPG, PNG and WebP images are allowed"
      ),
      false
    );
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;