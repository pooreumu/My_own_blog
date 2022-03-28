const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const articlesCtl = require("../controller/articles");

router.get("/articles", articlesCtl.showArticles);

router.post("/articles", authMiddleware, articlesCtl.writeArticles);

router.get("/articles/:articlesId", articlesCtl.showArticle);

router.delete("/articles/:articlesId", authMiddleware, articlesCtl.deleteArticles);

router.patch("/articles/:articlesId", authMiddleware, articlesCtl.reviseArticles);

module.exports = router;
