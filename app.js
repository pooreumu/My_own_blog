const express = require("express");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const Articles = require("./schemas/article");
const connect = require("./schemas");
const router = express.Router();
require("dotenv").config();

connect();

const app = express();
const port = 3000;

const articleRouter = require("./routes/articles");

const request_middleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.use(request_middleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("ejs", ejs.renderFile);
app.use("/api", articleRouter);

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

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
});
