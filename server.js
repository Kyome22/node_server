const dotenv = require("dotenv");
dotenv.config();
const env = process.env;
const express = require("express");
const app = express();
const fs = require("fs");

// ★★★ Initial Process ★★★
app.disable("x-powered-by");

process.on("SIGTERM", () => {
  console.log("Terminated server.js 🍪");
  process.exit(0);
});

// ★★★ Listen Port ★★★
app.listen(env.WEB_PORT, () => {
  console.log(`listen port ${env.WEB_PORT}`);
});

// ★★★ File Serve Utils ★★★
const errorSupport = (res, code) => {
  try {
    const data = fs.readFileSync("./public/html/error.html");
    res.writeHead(code, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("500 Internal Server Error");
    res.end();
  }
};

const responseFileSupport = (res, path, type) => {
  try {
    const data = fs.readFileSync(path);
    res.writeHead(200, { "Content-Type": type });
    res.write(data);
    res.end();
  } catch (err) {
    errorSupport(res, 404);
  }
};

// ★★★ File Serve ★★★
app.get("/", (_, res) => {
  responseFileSupport(res, "./public/html/index.html", "text/html");
});

app.get("/:dir/:file", (req, res) => {
  const dir = String(req.params.dir).toLocaleLowerCase();
  const file = String(req.params.file).toLocaleLowerCase();
  console.log(`get: ${file}`);
  switch (dir) {
    case "css": {
      responseFileSupport(res, `./public/css/${file}`, "text/css");
      break;
    }
    case "js": {
      responseFileSupport(res, `./public/js/${file}`, "text/javascript");
      break;
    }
    case "images": {
      if (file.endsWith(".svg")) {
        responseFileSupport(res, `./public/images/${file}`, "image/svg+xml");
      } else {
        responseFileSupport(res, `./public/images/${file}`, "image/*");
      }
      break;
    }
    default: {
      errorSupport(res, 404);
    }
  }
});

app.get("*", (_, res) => {
  errorSupport(res, 404);
});
