#!/usr/bin/env node

/**
 * Example usage:
 * node src/scripts/genMem.mjs 1000
 */

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { gzip as gzipSync } from "zlib";
import { promisify } from "util";
const gzip = promisify(gzipSync);

const root = resolve(new URL(".", import.meta.url).pathname, "..");

const [imgAmount] = process.argv.slice(2);

let template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Very big file</title>
    <style>html { margin: 0; } img { width: 100%; }</style>
  </head>
  <body>
    <a href="https://pixabay.com/photos/chicken-farm-yard-face-comb-8225658/">Pic source</a>
    <input type="text" autofocus>
`;

const cap = `</body></html>`;

(async () => {
  const buffer = await readFile(resolve(root, "assets", "chicken.jpg"));
  const base64 = buffer.toString("base64");
  const img = `<img src="data:image/jpg;base64,${base64}"/>\n`;

  for (let i = 0; i < Number(imgAmount); i++) {
    template += img;
  }
  const html = template.concat(cap);

  const out = resolve(root, "views", "index.html");
  await writeFile(out, html, { encoding: "utf-8" });
  console.info(`[${Buffer.from(html).length}] ${out} `);

  const gz = await gzip(html);
  await writeFile(out + ".gz", gz, { encoding: "base64" });
  console.info(`[${Buffer.from(gz).length}] ${out + ".gz"} `);
})();
