const express = require("express");
const ejs = require("ejs");
const Articles = require("./schemas/article");
const connect = require("./schemas");
require("dotenv").config();

connect();

const app = express();
const port = 3000;


const articleRouter = require("./routes/articles");

const request_middleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(request_middleware)
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.engine('ejs', ejs.renderFile);
app.use("/api", articleRouter);

app.get("/", (req, res) => {
    res.render("jo.ejs")
});

app.get("/detail/:articlesId", async (req, res) => {
    res.render("jasehi.ejs")
});

app.get("/write", (req, res) => {
    res.render("jacksung.ejs")
});

app.get("/revise/:articlesId", async (req, res) => {
    res.render("revise.ejs")
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});