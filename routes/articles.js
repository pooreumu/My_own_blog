const express = require("express");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");
const Articles = require("../schemas/article");
const Posts = require("../schemas/post");
const { User } = require("../models");
const connect = require("../schemas");
const router = express.Router();

connect();

const UsersSchema = Joi.object({
  nickname: Joi.string().required().min(3).alphanum(),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().required().min(4),
});

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } = await UsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }
    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ nickname }],
      },
    });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
    const user = await User.create({ nickname, password });

    res.status(201).send({});
  } catch (err) {
    res.status(400).send({
      errorMessage: "닉네임 3자 이상 알파벳과 숫자만",
    });
  }
});

router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ where: { nickname, password } });

  if (!user) {
    res.status(401).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요",
    });
    return;
  }
  const token_key = process.env.JWT_KEY;
  const token = jwt.sign({ userId: user.userId }, token_key);

  res.send({ token });
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      nickname: user.nickname,
    },
  });
});

router.get("/articles", async (req, res) => {
  const articles = await Articles.find().sort("-time");
  res.send({ articles });
});

router.post("/articles", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const Title = req.body.Title.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
  const Writer = nickname
    .replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
  const Contents = req.body.Contents.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
  const { PW, date, time } = req.body;

  const articlesId1 = await Articles.find().sort("-articlesId");

  if (articlesId1.length) {
    const articlesId2 = articlesId1[0]["articlesId"];
    const articlesId = articlesId2 + 1;

    const createdArticles = await Articles.create({
      articlesId,
      Title,
      Writer,
      PW,
      date,
      Contents,
      time,
    });
  } else {
    const articlesId = 1;

    const createdArticles = await Articles.create({
      articlesId,
      Title,
      Writer,
      PW,
      date,
      Contents,
      time,
    });
  }

  res.json({ result: "작성 완료!" });
});

router.get("/articles/:articlesId", async (req, res) => {
  const { articlesId } = req.params;

  const articles = await Articles.findOne({ articlesId });

  res.send({ articles });
});

router.delete("/articles/:articlesId", authMiddleware, async (req, res) => {
  const { articlesId } = req.params;
  const { PW } = req.body;

  const pwCheck = await Articles.find({ articlesId: Number(articlesId) });

  if (pwCheck[0]["PW"] === Number(PW)) {
    await Articles.deleteOne({ articlesId: Number(articlesId) });
    res.json({ result: "success" });
  } else {
    res.json({ result: "fail" });
  }
});

router.put("/articles/:articlesId", authMiddleware, async (req, res) => {
  const { articlesId } = req.params;

  const Title = req.body.Title.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");

  const Writer = req.body.Writer.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");

  const Contents = req.body.Contents.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");

  const { PW, date, time } = req.body;

  const pwCheck = await Articles.find({ articlesId: Number(articlesId) });

  if (pwCheck[0]["PW"] === Number(PW)) {
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, Writer, date, Contents, time } });
    res.json({ result: "success" });
  } else {
    res.json({ result: "fail" });
  }
});

router.get("/articles/:articlesId/post", async (req, res) => {
  const { articlesId } = req.params;
  const posts = await Posts.find({ articlesId: articlesId }).sort("-time");

  res.send({ posts });
});

router.post("/articles/:articlesId/post", authMiddleware, async (req, res) => {
  const { articlesId } = req.params;
  const Contents = req.body.Contents.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
  const { nickname } = res.locals.user;
  const Writer = nickname;
  const date = new Date();
  const time = date.getTime();

  const postsId1 = await Posts.find().sort("-postsId");

  if (postsId1.length) {
    const postsId2 = postsId1[0]["postsId"];
    const postsId = postsId2 + 1;

    await Posts.create({
      articlesId,
      postsId,
      Writer,
      Contents,
      time,
    });
  } else {
    const postsId = 1;

    await Posts.create({
      articlesId,
      postsId,
      Writer,
      Contents,
      time,
    });
  }

  res.json({ result: "작성 완료!" });
});

router.patch("/articles/:articlesId/post/:postsId", authMiddleware, async (req, res) => {
  const Contents = req.body.Contents.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
  const { postsId } = req.params;

  await Posts.updateOne({ postsId: postsId }, { $set: { Contents } });
  res.json({});
});

router.delete("/articles/:articlesId/post/:postsId", authMiddleware, async (req, res) => {
  const { postsId } = req.params;

  await Posts.deleteOne({ postsId: postsId });

  res.json({});
});
module.exports = router;
