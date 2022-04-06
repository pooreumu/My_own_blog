const express = require("express");
const connect = require("./schemas");
const ejs = require("ejs");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
require("dotenv").config();

connect();

const app = express();

const articleRouter = require("./routes/articles");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const renderCtl = require("./controller/render");

const request_middleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.disable("x-powered-by");
app.use(request_middleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("ejs", ejs.renderFile);
app.use("/api", [articleRouter, authRouter, postRouter]);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", renderCtl.renderList());

app.get("/detail/:articlesId", renderCtl.renderDetail());

app.get("/write", renderCtl.renderWrite());

app.get("/revise/:articlesId", renderCtl.renderRevise());

app.get("/signup", renderCtl.renderSignup());

app.get("/signin", renderCtl.renderSignin());

module.exports = app;
