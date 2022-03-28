const { User } = require("../models");
const { Op } = require("sequelize");
const UsersSchema = require("../middlewares/joi");
const jwt = require("jsonwebtoken");

async function sign_up(req, res) {
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
    await User.create({ nickname, password });

    res.status(201).send({});
  } catch (err) {
    res.status(400).send({
      errorMessage: "닉네임 3자 이상 알파벳과 숫자만",
    });
  }
}

async function sign_in(req, res) {
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
}

async function auth(req, res) {
  const { user } = res.locals;
  res.send({
    user: {
      nickname: user.nickname,
    },
  });
}
module.exports = { sign_up, sign_in, auth };
