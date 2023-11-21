import { createServer } from "http";
import normal from "./src/normal.mjs";
import gzip from "./src/gzip.mjs";

const server = createServer(async (req, res) => {
  switch (new URL(req.url, "http://127.0.0.1:8000").pathname) {
    case "/normal":
      return await normal(req, res);
    case "/gzip":
      return await gzip(req, res);
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.info("Exposed http://localhost:8000")
);
