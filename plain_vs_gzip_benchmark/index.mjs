#!/usr/bin/env node

import { chromium } from "playwright";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";

const publicFolder = resolve(new URL(".", import.meta.url).pathname, "public");

const sizes = magnitudo(Number(process.argv.at(2) || 1));
console.info(`Sizes: ${sizes.join(", ")}`);

function magnitudo(n) {
  return Array.from({ length: n }, (_, i) => 10 ** i);
}

const HOST = "127.0.0.1";
const PORT = 8000;

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${HOST}:${PORT}`);

  let [size, gzip] = pathname.split("/").filter(Boolean);
  size = Number(size);
  if(isNaN(size)) return res.writeHead(400).end("Bad Request")

  let filename = `index-${size}.html`;
  if (gzip) filename += ".gz";

  const data = await readFile(resolve(publicFolder, filename));
  res.setHeader("Content-Type", "text/html");
  if (gzip) res.setHeader("Content-Encoding", "gzip");

  res.writeHead(200).end(data);
});

(async () => {
  await new Promise((resolve) =>
    server.listen(PORT, HOST, () => {
      console.info(`Exposed on http://${HOST}:${PORT}`);
      resolve();
    })
  );

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const reports = new Map();

  // page.on("response", async (response) => {
  //   const request = response.request();

  //   const startTime = performance.now();

  //   const report = {
  //     duration: performance.now(),
  //     bytes: Buffer.from(await response.body()).length,
  //   };

  //   report.duration = performance.now() - startTime;

  //   reports.set(request.url(), report);
  // });

  // page.on("domcontentloaded", () => {
  //   const report = {
  //     duration: performance.now(),
  //   };

  //   report.duration -= reports.get(page.url())?.duration || 0;

  //   reports.set(page.url(), report);
  // });

  for (let size of sizes) {
    let url = `http://${HOST}:${PORT}/${size}`;
    await page.goto(url);

    url += `/gzip`;
    await page.goto(url);
  }

  await browser.close();

  // await new Promise((resolve) => {
  //   server.close(() => {
  //     console.log("Done!");
  //     console.log(reports);
  //     resolve();
  //   });
  // });
})();
