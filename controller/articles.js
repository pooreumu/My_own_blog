const Articles = require("../schemas/article");
const Posts = require("../schemas/post");
const { Likes } = require("../models");

async function showArticles(req, res) {
  // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
  // #swagger.tags = ["GET"]
  // #swagger.summary = "겟 조회"
  const articles = await Articles.find().sort("-time");

  res.json({ articles });
}

async function writeArticles(req, res) {
  // #swagger.description = "여기는 포스트를 보여주는 곳 입니다."
  // #swagger.tags = ["POST"]
  // #swagger.summary = "포스트 조회"
  const { nickname } = res.locals.user;
  const Writer = nickname;
  const Title = req.body.Title.replace(/\&/g, "&#38;")
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
  const { date, time } = req.body;
  const likes = 0;

  const articlesId1 = await Articles.find().sort("-articlesId");

  if (articlesId1.length) {
    const articlesId2 = articlesId1[0]["articlesId"];
    const articlesId = articlesId2 + 1;

    await Articles.create({
      articlesId,
      Title,
      Writer,
      date,
      Contents,
      time,
      likes,
    });
  } else {
    const articlesId = 1;

    await Articles.create({
      articlesId,
      Title,
      Writer,
      date,
      Contents,
      time,
      likes,
    });
  }

  res.json({ result: "작성 완료!" });
}
async function showArticle(req, res) {
  // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
  // #swagger.tags = ["GET"]
  // #swagger.summary = "겟 조회"
  const { articlesId } = req.params;
  const articles = await Articles.findOne({ articlesId });
  try {
    const nickname = req.query.nickname;

    const { done } = await Likes.findOne({ where: { articlesId, nickname } });

    res.json({ articles, done });
  } catch (err) {
    const done = 0;
    res.json({ articles, done });
  }
}
async function reviseArticles(req, res) {
  // #swagger.description = "여기는 패치를 보여주는 곳 입니다."
  // #swagger.tags = ["PATCH"]
  // #swagger.summary = "패치 조회"
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Articles.findOne({ articlesId });
  if (nickname !== Writer) {
    return res.status(400).send("Fuck You");
  }

  const Title = req.body.Title.replace(/\&/g, "&#38;")
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

  const { date, time } = req.body;

  const check = await Articles.find({ articlesId: Number(articlesId) });

  if (check) {
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, date, Contents, time } });
    res.json({ result: "success" });
  } else {
    res.status(400).json({ result: "fail" });
  }
}
async function deleteArticles(req, res) {
  // #swagger.description = "여기는 딜리트를 보여주는 곳 입니다."
  // #swagger.tags = ["DELETE"]
  // #swagger.summary = "딜리트 조회"
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Articles.findOne({ articlesId });
  if (nickname !== Writer) {
    return res.status(400).send("Fuck You");
  }

  const check = await Articles.find({ articlesId: Number(articlesId) });

  if (check) {
    await Articles.deleteOne({ articlesId: Number(articlesId) });
    await Posts.deleteMany({ articlesId });
    res.json({ result: "success" });
  } else {
    res.status(400).json({ result: "fail" });
  }
}

async function likesArticles(req, res) {
  // #swagger.description = "여기는 패치를 보여주는 곳 입니다."
  // #swagger.tags = ["PATCH"]
  // #swagger.summary = "패치 조회"
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  let { likes } = await Articles.findOne({ articlesId });
  try {
    const { done, id } = await Likes.findOne({ where: { articlesId, nickname } });
    if (done) {
      await Likes.update({ done: 0 }, { where: { id } });
      likes--;
    } else {
      await Likes.update({ done: 1 }, { where: { id } });
      likes++;
    }
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { likes } });
    res.json({});
  } catch (err) {
    likes++;
    await Likes.create({ articlesId, nickname, done: 1 });
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { likes } });
    res.json({});
  }
}

module.exports = { showArticles, writeArticles, showArticle, reviseArticles, deleteArticles, likesArticles };
