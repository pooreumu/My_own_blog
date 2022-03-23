const express = require("express");
const Articles = require("../schemas/article")
const connect = require("../schemas");
const router = express.Router();

connect();

router.get("/", (req, res) => {
    res.send("전체 게시글 목록 조회 페이지")
})

router.get("/articles", async (req, res) => {
    const articles1 = await Articles.find()
    let articles = articles1.sort((a,b) => b.time - a.time)
    res.send({ articles })
})

router.get("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const articles = await Articles.findOne({ articlesId })
    res.send({ articles })
})

router.post("/articles", async (req, res) => {
    const Title = req.body.Title.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const Writer = req.body.Writer.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const Contents = req.body.Contents.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const { PW, date, time } = req.body
    const articlesId1 = await Articles.find()
    if (articlesId1.length) {
        const articlesId2 = articlesId1.sort((a,b) => b.articlesId - a.articlesId)
        const articlesId3 = articlesId2[0]['articlesId']
        const articlesId = articlesId3 + 1
        const createdArticles = await Articles.create({ articlesId, Title, Writer, PW, date, Contents, time })
    }else {
        const articlesId = 1
        const createdArticles = await Articles.create({ articlesId, Title, Writer, PW, date, Contents, time })
    }
    

    

    res.json({ result: "작성 완료!" })

})

router.delete("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const { PW } = req.body
    const pwCheck = await Articles.find({ articlesId: Number(articlesId) })

    if (pwCheck[0]["PW"] === Number(PW)) {
        await Articles.deleteOne({ articlesId: Number(articlesId) })
        res.json({ result: "success" })
    }else{
        res.json({ result: "fail" })
    }
})

router.put("/articles/:articlesId", async (req, res) => {
    const { articlesId } = req.params
    const Title = req.body.Title.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const Writer = req.body.Writer.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const Contents = req.body.Contents.replace(/\&/g,"&#38;").replace(/\</g,"&#60;").replace(/\>/g,"&gt;").replace(/\$/g,"&#36;").replace(/\//g,"&#47;").replace(/\'/g,"&#39;").replace(/\(/g,"&#40;").replace(/\)/g,"&#41;")
    const { PW, date, time } = req.body
    const pwCheck = await Articles.find({ articlesId: Number(articlesId) })
    if(pwCheck[0]["PW"] === Number(PW)) {
        await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, Writer, date, Contents, time }})
        res.json({ result: "success" })
    }else{
        res.json({ result: "fail" })
    }
})
module.exports = router