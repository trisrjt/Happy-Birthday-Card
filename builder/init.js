const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

if (!process.env.NAME) throw new Error("Please specify NAME in environment.");
if (!process.env.PIC) throw new Error("Please specify PIC in environment.");

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;
const msgText = process.env.SCROLL_TEXT;

// Resolve scroll markup from various sources
const resolveScrollMarkup = async (mode) => {
  // Priority 1: inline text via SCROLL_TEXT env var
  if (msgText) {
    return generateMarkupLocal(msgText);
  }

  if (!msgPath) return "";

  if (mode === "local") {
    // Local file read
    const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
      encoding: "utf-8",
    });
    return generateMarkupLocal(text);
  }

  if (mode === "remote" || mode === "ci") {
    // Check if it's a telegra.ph URL
    if (msgPath.includes("telegra.ph")) {
      const article = msgPath.split("/").pop();
      const res = await axios.get(
        `https://api.telegra.ph/getPage/${article}?return_content=true`
      );
      const { content } = res.data.result;
      return content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }

    // Otherwise treat as local file (CI mode: file must exist in local/)
    if (mode === "ci") {
      const localPath = path.join(__dirname, "../local/", msgPath);
      if (fs.existsSync(localPath)) {
        const text = fs.readFileSync(localPath, { encoding: "utf-8" });
        return generateMarkupLocal(text);
      }
      console.warn(
        `SCROLL_MSG file "${msgPath}" not found in local/. Skipping scroll.`
      );
      return "";
    }
  }

  return "";
};

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    const markup = await resolveScrollMarkup("local");
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization (PIC must be a public URL)
const setRemoteData = async () => {
  try {
    const res = await axios.get(picPath, {
      responseType: "arraybuffer",
    });
    const pic = res.data;
    const markup = await resolveScrollMarkup("remote");
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

// CI initialization: PIC can be a URL or a local file path
// Image is embedded as base64 data URL so no external hosting needed
const setCIData = async () => {
  try {
    let pic;
    const isUrl = picPath.startsWith("http://") || picPath.startsWith("https://");

    if (isUrl) {
      const res = await axios.get(picPath, {
        responseType: "arraybuffer",
      });
      pic = Buffer.from(res.data);
    } else {
      // Try local/ folder first, then project root
      const localFile = path.join(__dirname, "../local/", picPath);
      const rootFile = path.join(__dirname, "../", picPath);
      if (fs.existsSync(localFile)) {
        pic = localFile;
      } else if (fs.existsSync(rootFile)) {
        pic = rootFile;
      } else {
        throw new Error(
          `PIC file "${picPath}" not found in local/ or project root.`
        );
      }
    }

    const markup = await resolveScrollMarkup("ci");
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

if (process.argv[2] === "--local") setLocalData();
else if (process.argv[2] === "--remote") setRemoteData();
else if (process.argv[2] === "--ci") setCIData();
else console.log("Fetch mode not specified. Use --local, --remote, or --ci");
