const express = require("express");
const Articles = require("../schemas/article")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("전체 게시글 목록 조회 페이지")
})

router.get("/articles", async (req, res, next) => {
    const articles = await Articles.find()
    res.json({ articles })
})

router.get("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const articles = await Articles.findOne({ articlesId })
    res.json({ articles })
})

router.post("/articles", async (req, res) => {
    const { articlesId, Title, Writer, PW, Date, Contents } = req.body

    const createdArticles = await Articles.create({ articlesId, Title, Writer, PW, Date, Contents })

    res.json({ articles: createdArticles })

})

router.delete("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params

    const deleteArticles = await Articles.deleteOne({ articlesId })

    res.json({ result: "삭제 완료!"})
})

router.put("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const { Title, Writer, PW, Date, Contents } = req.body

    const pwCheck = await Articles.find({ articlesId: Number(articlesId) })
    if(pwCheck[0]["PW"] === PW) {
        await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, Writer, Date, Contents }})
    }
    
    res.json({ success: true })
})
module.exports = router