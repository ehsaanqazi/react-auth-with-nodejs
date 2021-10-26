require("dotenv").config();
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");

const csrfMiddleware = csurf({
  cookie: true,
});

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

// MIDDLEWARES
app.use(express.static(path.resolve("./public")));
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(csrfMiddleware);
let token = "";
app.use(function (req, res, next) {
  token = req.csrfToken();
  res.cookie("csrf-token", token);
  res.locals.csrfToken = "d";
  next();
});
app.get("/api", (req, res) => {
  res.status(200).json({
    title: "React Authentication with Nodejs",
    CSRF_TOKEN: token,
  });
});

// ERROR HANDLING
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403);
  res.json({ message: "Invalid CSRF Token" });
});
// app.use(function (req, res, next) {
//   res.status(400).json({ message: "Not Found" });
//   next();
// });

// ENVIRONMENT VARIABLES
let port = process.env.PORT || 3000;
const api = process.env.API_URL;

// ROUTES
app.use(`${api}/`, require("./routes/users"));

// DATABASE CONNECTION
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "authentication",
  })
  .then(() => {
    console.log("Database Connected Sucessfully...");
  })
  .catch((err) => {
    console.log(err);
  });

// SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
