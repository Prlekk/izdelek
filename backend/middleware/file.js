const multer = require("multer");

function replaceNonAsciiCharacters(str) {
  const nonAsciiMap = {
      '¹': 's',
      'è': 'c',
      'æ': 'c',
      '¾': 'z',
  };
  return str.replace(/[^\x00-\x7F]/g, (char) => {
      return nonAsciiMap[char] || char;
  });
}

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const originalname = replaceNonAsciiCharacters(file.originalname)
    const name = originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    console.log(name);
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");