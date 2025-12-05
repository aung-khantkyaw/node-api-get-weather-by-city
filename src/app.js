const path = require("path");
const express = require("express");

const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(routes);

// Ensure the landing page still responds on /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
