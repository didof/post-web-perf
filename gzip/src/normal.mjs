import { getView } from "./utils.mjs";

export default async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  let [html, errRead] = await getView("index.html", "utf-8");
  if (errRead) {
    console.error(errRead);
    return res.writeHead(500).end("Internal Server error");
  }

  res.writeHead(200).end(html);
};
