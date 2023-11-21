import { createServer } from "http";
import { getView, combinations } from "./src/utils.mjs";

const server = createServer(async (req, res) => {
  const { searchParams: sp } = new URL(req.url, "http://127.0.0.1:8000");

  // Ready query params
  const length = sp.get("content-length") === "true" || false;
  const gzip = sp.get("gzip") === "true" || false;
  const transfer = sp.get("transfer") || null;

  // Either index.html or index.html.gz
  let view = "index.html";
  if (gzip) view += ".gz";

  const [data, stats, err] = await getView(view);
  if (err) return abort(err, res);

  res.setHeader("Content-Type", "text/html");

  if (length) res.setHeader("Content-Length", stats.size);

  if (gzip) res.setHeader("Content-Encoding", "gzip");

  if (["identity", "chunked"].includes(transfer))
    res.setHeader("Transfer-Encoding", transfer);

  return res.writeHead(200).end(data);
});

server.listen(8000, "127.0.0.1", () => {
  console.info(combinations().join("\n"));
});

function abort(err, res) {
  console.error(err);
  return res.writeHead(500).end("Internal Server error");
}
