import { getView } from "./utils.mjs";

export default async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const [gz, errRead] = await getView("index.html.gz");
  if (errRead) {
    console.error(errRead);
    return res.writeHead(500).end("Internal Server error");
  }

  res.setHeader("Content-Encoding", "gzip");
  res.writeHead(200).end(gz);
};
