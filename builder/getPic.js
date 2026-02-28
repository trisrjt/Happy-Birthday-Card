const sharp = require("sharp");

/**
 * Process and save the profile picture.
 * @param {string|Buffer} pic - File path string OR image Buffer
 */
const setPic = async function (pic) {
  await sharp(pic)
    .rotate()            // auto-rotate based on EXIF (replaces hardcoded 90°)
    .resize(400, 400, { fit: "cover", position: "attention" })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile("src/pic.jpeg");
  return console.log("IMAGE processed successfully!");
};

module.exports = setPic;
