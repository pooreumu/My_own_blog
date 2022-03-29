const express = require("express");
const ejs = require("ejs");
const connect = require("./schemas");
require("dotenv").config();

connect();

const app = express();

const articleRouter = require("./routes/articles");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const request_middleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

function removeHeader() {
  return function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
  };
}

app.use(removeHeader()); //x-Powerd-By 제거
app.use(request_middleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("ejs", ejs.renderFile);
app.use("/api", [articleRouter, authRouter, postRouter]);

app.get("/", (req, res) => {
  res.render("list.ejs");
});

app.get("/detail/:articlesId", (req, res) => {
  res.render("detail.ejs");
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.get("/revise/:articlesId", (req, res) => {
  res.render("revise.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

module.exports = app;
