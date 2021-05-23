var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var router = require("./routes");
var app = express();
const tmImage = require('@teachablemachine/image');

const domino = require("domino");
const fs = require("fs");
const filename = path.join(__dirname, "views/layout.html");
const template = fs.readFileSync(filename).toString();

const win = domino.createWindow(template);
global["window"] = win;
global["document"] = win.document;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// inisialisasi variabel global teachablemachine
async function init() {
  const modelURL = "http://localhost:5000/model.json";
  // load modul Teachable Machine menggunakan model.json
  let model = await tmImage.load(modelURL, {
    tfjsVersion: "1.3.1",
    tmVersion: "2.3.1",
    packageVersion: "0.8.4",
    packageName: "@teachablemachine/image",
    timeStamp: "2021-05-12T04:56:02.221Z",
    userMetadata: {},
    modelName: "tm-my-image-model",
    labels: ["Obat", "hadi", "MinumObat"],
  });
  let webcam = new tmImage.Webcam(200, 200, true);
  global.teachablemachine = {
    model: model,
    webcam: webcam,
  };
}

init();

app.use(express.json({ limit: 524288 }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("my_model"));

app.use("/", router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
