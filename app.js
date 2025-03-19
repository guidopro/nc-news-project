const cors = require("cors");
const express = require("express");
const app = express();
const { badRequest, miscErrors, custErrors } = require("./error-handling");
const apiRouter = require("./routes/api-router");
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

// error handling
app.use(badRequest);
app.use(miscErrors);
app.use(custErrors);

module.exports = app;
