import express from "express";
import fs from "fs";
import mime from "mime";

import { HTTP_PORT } from "../config/config.js";
import { getFilePath } from "../services/tokenService.js";

const app = express();

// ==========================
// DOWNLOAD FILE
// ==========================

app.get(
  "/download/:token",
  (req, res) => {

    const token =
      req.params.token;

    const filePath =
      getFilePath(token);

    if (!filePath) {

      return res
        .status(404)
        .send("Invalid Token");

    }

    res.sendFile(filePath);

  }
);

// ==========================
// STREAM VIDEO
// ==========================
app.get(
  "/video/:token",
  (req, res) => {

    const token = req.params.token;

    const filePath = getFilePath(token);

    if (!filePath) {
      return res.status(404).send("Invalid Token");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    console.log("Range:", range);

    const contentType =
      mime.getType(filePath) ||
      "application/octet-stream";

    // ==========================
    // NO RANGE HEADER
    // ==========================

    if (!range) {

      res.writeHead(200, {

        "Content-Length": fileSize,

        "Content-Type": contentType,

        "Accept-Ranges": "bytes",

      });

      fs.createReadStream(filePath)
        .pipe(res);

      return;
    }

    // ==========================
    // RANGE REQUEST
    // ==========================

    const parts =
      range
        .replace(/bytes=/, "")
        .split("-");

    const start =
      parseInt(parts[0], 10);

    const end =
      parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

    const chunkSize =
      end - start + 1;

    console.log(
      `Streaming ${start}-${end}`
    );

    res.writeHead(206, {

      "Content-Range":
        `bytes ${start}-${end}/${fileSize}`,

      "Accept-Ranges":
        "bytes",

      "Content-Length":
        chunkSize,

      "Content-Type":
        contentType,

    });

    fs.createReadStream(
      filePath,
      {
        start,
        end,
      }
    ).pipe(res);

  }
);

// ==========================

export default function startHttpServer() {

  app.listen(
    HTTP_PORT,
    () => {

      console.log(
        `HTTP Server Running on ${HTTP_PORT}`
      );

    }
  );

}