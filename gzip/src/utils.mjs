import { resolve } from "path";
import { readFile } from "fs/promises";

const root = resolve(new URL(".", import.meta.url).pathname, "..");

export function to(promise) {
  return promise.then((res) => [res, null]).catch((err) => [null, err]);
}

export async function getView(name, encoding) {
  const filepath = resolve(root, "src", "views", name);
  return await to(readFile(filepath, encoding));
}
