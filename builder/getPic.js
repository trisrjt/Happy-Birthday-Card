const sharp = require("sharp");

const setPic = async function (pic) {
  await sharp(pic)
    .rotate(90)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/pic.jpeg`);
  return console.log("IMAGE Downloaded successfully!!!");
};

module.exports = setPic;
