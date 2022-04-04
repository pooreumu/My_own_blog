const Posts = require("../schemas/post");

async function showPost(req, res) {
  const { articlesId } = req.params;
  const posts = await Posts.find({ articlesId: articlesId }).sort("-time");

  res.json({ posts });
}

async function writePost(req, res) {
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
}

async function revisePost(req, res) {
  const { postsId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Posts.findOne({ postsId });
  if (nickname !== Writer) {
    return res.send("Fuck You");
  }
  const Contents = req.body.Contents.replace(/\&/g, "&#38;")
    .replace(/\</g, "&#60;")
    .replace(/\>/g, "&gt;")
    .replace(/\$/g, "&#36;")
    .replace(/\//g, "&#47;")
    .replace(/\'/g, "&#39;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");

  await Posts.updateOne({ postsId: postsId }, { $set: { Contents } });
  res.json({});
}

async function deletePost(req, res) {
  const { postsId } = req.params;
  const { nickname } = res.locals.user;
  const { Writer } = await Posts.findOne({ postsId });
  if (nickname !== Writer) {
    return res.send("Fuck You");
  }

  await Posts.deleteOne({ postsId: postsId });

  res.json({});
}

module.exports = { showPost, writePost, revisePost, deletePost };
