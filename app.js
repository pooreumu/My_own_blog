const express = require("express");
const ejs = require("ejs");
const connect = require("./schemas");

connect();

const app = express();
const port = 3000;

app.engine('ejs', ejs.renderFile);



const articleRouter = require("./routes/articles");

const request_middleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.json())
app.use(request_middleware)
app.use("/api", articleRouter);

app.get("/", (req, res) => {
    res.render("jo.ejs")
});

app.get("/write", (req, res) => {
    res.render("jacksung.ejs")
})

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
})