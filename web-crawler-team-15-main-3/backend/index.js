const express = require("express");
const app = express();
const test_case = require("./crawler/crawler.js");
const multer = require("multer");
const fs = require("fs/promises");
const crawler = require("./crawler/crawler.js");
const closenessCentrality = require("./crawler/centrality.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Custom filename
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/graphit", async (req, res) => {
  const { url, depth } = req.query;
  console.log(url, depth);

  let nodesAndEdges = await test_case(url, depth);
  console.log("Here are the nodes/edges: " + nodesAndEdges);
  res.send(nodesAndEdges);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.post("/crawl", upload.single("file"), async (req, res) => {
  //Async?
  const { depth } = req.query;
  const file = req.file;

  let nodesAndEdges = await crawler(file.path, depth);

  console.log("Calculating Closeness Centrality...");

  closenessCentrality(
    nodesAndEdges.nodes,
    nodesAndEdges.links,
    nodesAndEdges.graphs
  );

  //Delete used file
  try {
    await fs.unlink(file.path);
    // console.log("File removed successfully.");
  } catch (error) {
    console.error("Error removing file:", error);
  }

  res.send(nodesAndEdges);
});
