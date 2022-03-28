const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const postsCtl = require("../controller/posts");

router.get("/articles/:articlesId/post", postsCtl.showPost);

router.post("/articles/:articlesId/post", authMiddleware, postsCtl.writePost);

router.patch("/articles/:articlesId/post/:postsId", authMiddleware, postsCtl.revisePost);

router.delete("/articles/:articlesId/post/:postsId", authMiddleware, postsCtl.deletePost);

module.exports = router;
