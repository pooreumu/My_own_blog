const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const articlesCtl = require("../controller/articles");

router.post("/articles", authMiddleware, articlesCtl.writeArticles);

router.get("/articles", articlesCtl.showArticles);

router.get("/articles/:articlesId", articlesCtl.showArticle);

router.patch("/articles/:articlesId", authMiddleware, articlesCtl.reviseArticles);

router.delete("/articles/:articlesId", authMiddleware, articlesCtl.deleteArticles);

router.patch("/articles/:articlesId/likes", authMiddleware, articlesCtl.likesArticles);

module.exports = router;
