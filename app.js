const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { errorHandler, notFound } = require("./MiddleWare/error");
const connectToDb = require("./config/db");

// routes
const item = require("./routes/itemRoute");
const mover = require("./routes/moverRoute");

// Init App
const app = express();
// Connection To Db
connectToDb();

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Routes
app.use("/api/item", item);
app.use("/api/mover", mover);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
