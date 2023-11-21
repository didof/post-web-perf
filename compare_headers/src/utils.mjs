import { resolve } from "path";
import { readFile, stat } from "fs/promises";

const root = resolve(new URL(".", import.meta.url).pathname, "..");

export async function getView(name, encoding) {
  const filepath = resolve(root, "src", "views", name);

  const [data, stats] = await Promise.allSettled([
    readFile(filepath, encoding),
    stat(filepath),
  ]);
  if (data.status === "rejected")
    return [null, null, new Error("could not retrieve data")];
  if (stats.status === "rejected")
    return [null, null, new Error("could not retrieve stats")];

  return [data.value, stats.value, null];
}

export function createURL(
  { gzip, length, identity } = {
    gzip: false,
    length: false,
    identity: false,
  }
) {
  // Use pathname so that in Developer Tools you can filter out the favicon.
  const url = new URL("big", "http://127.0.0.1:8000");
  if (gzip) url.searchParams.set("gzip", "true");
  if (length) url.searchParams.set("content-length", "true");
  if (identity) url.searchParams.set("identity", "true");
  return url.toString();
}

export function combinations() {
  const urls = [createURL()];
  for (const gzip of [false, true]) {
    for (const length of [false, true]) {
      for (const transfer of ["identity", "chunked"]) {
        urls.push(
          createURL({
            gzip,
            length,
            [transfer]: true,
          })
        );
      }
    }
  }
  return urls;
}
