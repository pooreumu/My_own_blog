function renderList() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("list.ejs");
  };
}

function renderDetail() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("detail.ejs");
  };
}

function renderWrite() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("write.ejs");
  };
}

function renderRevise() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("revise.ejs");
  };
}

function renderSignup() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("signup.ejs");
  };
}

function renderSignin() {
  return (req, res) => {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    res.render("signin.ejs");
  };
}

module.exports = { renderDetail, renderList, renderRevise, renderSignin, renderSignup, renderWrite };
