const Articles = require("../schemas/article");
const Posts = require("../schemas/post");

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
    });
  }

  res.json({ result: "작성 완료!" });
}
async function showArticle(req, res) {
  const { articlesId } = req.params;

  const articles = await Articles.findOne({ articlesId });

  res.send({ articles });
}
async function reviseArticles(req, res) {
  const { articlesId } = req.params;

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

  const Check = await Articles.find({ articlesId: Number(articlesId) });

  if (Check) {
    await Articles.updateOne({ articlesId: Number(articlesId) }, { $set: { Title, date, Contents, time } });
    res.json({ result: "success" });
  } else {
    res.json({ result: "fail" });
  }
}
async function deleteArticles(req, res) {
  const { articlesId } = req.params;

  const Check = await Articles.find({ articlesId: Number(articlesId) });

  if (Check) {
    await Articles.deleteOne({ articlesId: Number(articlesId) });
    await Posts.deleteMany({ articlesId });
    res.json({ result: "success" });
  } else {
    res.json({ result: "fail" });
  }
}

module.exports = { showArticles, writeArticles, showArticle, reviseArticles, deleteArticles };
