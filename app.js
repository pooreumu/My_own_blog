const express = require("express");
const connect = require("./schemas");

connect();

const app = express();
const port = 3000;



const articleRouter = require("./routes/articles");

const request_middleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.json())
app.use(request_middleware)

app.use("/api", articleRouter);

app.get("/", (req, res) => {
    res.send("landing page")
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
})