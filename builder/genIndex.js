const fs = require("fs");
const path = require("path");

const genIndex = function (markup) {
  let html = fs.readFileSync(path.join(__dirname, "../src/template.html"), {
    encoding: "utf-8",
  });

  let readTime = "",
    readVar = "";

  if (markup && markup.length) {
    readTime = (markup.split(" ").length / 200) * 60;
    readVar = `<style>:root{
      --readTime: ${Math.round(readTime) + 15}s;
    }</style>`;
  }

  const openDate = process.env.OPEN_DATE
    ? `<meta name="open-date" content="${process.env.OPEN_DATE}" />`
    : "";

  html = html
    .replace("{{^READ_TIME}}", readVar)
    .replace("{{^SCROLL_MSG}}", markup || "")
    .replace(
      "{{^HBD_MSG}}",
      process.env.HBD_MSG || "Wish you a very Happy Birthday"
    )
    .replace("{{^NAME}}", process.env.NAME)
    .replace("{{^NICKNAME}}", process.env.NICKNAME || process.env.NAME)
    .replace("{{^OPEN_DATE}}", openDate);

  fs.writeFileSync(path.join(__dirname, "../src/index.html"), html, {
    encoding: "utf-8",
  });
  console.log("Index Generated successfully!");
};

module.exports = genIndex;
