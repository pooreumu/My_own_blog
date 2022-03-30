const Articles = require("../schemas/article");
const Posts = require("../schemas/post");
const { Likes } = require("../models");

async function showArticles(req, res) {
  const articles = await Articles.find().sort("-time");

  res.send({ articles });
}

async function writeArticles(req, res) {
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
  const { articlesId } = req.params;
  const articles = await Articles.findOne({ articlesId });
  try {
    const nickname = req.query.nickname;

    const { done } = await Likes.findOne({ where: { articlesId, nickname } });

    res.send({ articles, done });
  } catch (err) {
    const done = 0;
    res.send({ articles, done });
  }
}
async function reviseArticles(req, res) {
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Articles.findOne({ articlesId });
  console.log(nickname);
  console.log(Writer);
  if (nickname !== Writer) {
    return res.send("Fuck You");
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
    res.json({ result: "fail" });
  }
}
async function deleteArticles(req, res) {
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Articles.findOne({ articlesId });
  console.log(nickname);
  console.log(Writer);
  if (nickname !== Writer) {
    return res.send("Fuck You");
  }

  const check = await Articles.find({ articlesId: Number(articlesId) });

  if (check) {
    await Articles.deleteOne({ articlesId: Number(articlesId) });
    await Posts.deleteMany({ articlesId });
    res.json({ result: "success" });
  } else {
    res.json({ result: "fail" });
  }
}

async function likesArticles(req, res) {
  const { articlesId } = req.params;
  const { nickname } = res.locals.user;
  let { likes } = await Articles.findOne({ articlesId });
  console.log(articlesId);
  console.log(1);
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
    res.send({});
  } catch (err) {
    likes++;
    await Likes.create({ articlesId, nickname, done: 1 });
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { likes } });
    res.send({});
  }
}

module.exports = { showArticles, writeArticles, showArticle, reviseArticles, deleteArticles, likesArticles };
