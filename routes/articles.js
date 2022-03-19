const express = require("express");
const Articles = require("../schemas/article")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("전체 게시글 목록 조회 페이지")
})

router.get("/articles", async (req, res, next) => {
    const articles = await Articles.find()
    res.send({ articles })
})

router.get("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const articles = await Articles.findOne({ articlesId })
    res.render("jasehi.ejs", { articles: articles })
})

router.post("/articles", async (req, res) => {
    const Title = req.body.Title
    const Writer = req.body.Writer
    const PW = req.body.PW
    const date = req.body.date
    const Contents = req.body.Contents
    console.log(Title)
    console.log(Writer)
    console.log(PW)
    console.log(date)
    console.log(Contents)
    const articlesId1 = await Articles.find()
    const articlesId = articlesId1.length + 1
    const createdArticles = await Articles.create({ articlesId: articlesId, Title: Title, Writer: Writer, PW: PW, date: date, Contents: Contents })

    res.send({ result: "작성 완료!" })

})

router.delete("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params

    const deleteArticles = await Articles.deleteOne({ articlesId })

    res.json({ result: "삭제 완료!"})
})

router.put("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const { Title, Writer, PW, date, Contents } = req.body

    const pwCheck = await Articles.find({ articlesId: Number(articlesId) })
    if(pwCheck[0]["PW"] === PW) {
        await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, Writer, date, Contents }})
    }
    
    res.json({ success: true })
})
module.exports = router