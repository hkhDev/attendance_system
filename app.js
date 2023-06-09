const express = require("express");
const app = express();

const port = process.env.PORT || 2000;

app.use(express.json());
app.use(require("./routes/attendance"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server is running on " + port);
});
