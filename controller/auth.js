const { User } = require("../models");
const { Op } = require("sequelize");
const UsersSchema = require("../middlewares/joi");
const jwt = require("jsonwebtoken");

async function sign_up(req, res) {
    // #swagger.description = "여기는 포스트를 보여주는 곳 입니다."
    // #swagger.tags = ["POST"]
    // #swagger.summary = "포스트 조회"
    try {
        const { nickname, password, confirmPassword } = await UsersSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            res.status(400).json({
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
            res.status(400).json({
                errorMessage: "중복된 닉네임입니다.",
            });
            return;
        }
        if (password.indexOf(nickname) !== -1) {
            res.status(400).json({
                errorMessage: "사용할 수 없는 암호입니다",
            });
            return;
        }
        const refreshToken = "";
        await User.create({ nickname, password, refreshToken });

        res.status(201).json({});
    } catch (err) {
        res.status(400).json({
            errorMessage: "닉네임 영어나 숫자만 3자이상, 암호4자이상",
        });
    }
}

async function sign_in(req, res) {
    // #swagger.description = "여기는 포스트를 보여주는 곳 입니다."
    // #swagger.tags = ["POST"]
    // #swagger.summary = "포스트 조회"
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
        res.status(401).json({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요",
        });
        return;
    }
    const token_key = process.env.JWT_KEY;
    const token = jwt.sign({ userId: user.userId }, token_key, { expiresIn: "5s" });
    const refreshToken = jwt.sign({}, token_key, { expiresIn: "14d" });

    await User.update({ refreshToken }, { where: { userId: user.userId } });

    res.json({ token });
}

async function auth(req, res) {
    // #swagger.description = "여기는 겟을 보여주는 곳 입니다."
    // #swagger.tags = ["GET"]
    // #swagger.summary = "겟 조회"
    const { user } = res.locals;
    res.json({
        user: {
            nickname: user.nickname,
        },
    });
}

async function sign_in_test(req, res) {
    try {
        const { nickname, password } = req.body;

        const user = await User.findOne({ where: { nickname, password } });

        const token_key = process.env.JWT_KEY;
        const token = jwt.sign({ userId: user.userId }, token_key);

        res.send({ token });
    } catch (err) {
        res.status(401).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요",
        });
        return;
    }
}

async function sign_up_test(req, res) {
    try {
        const { nickname, password, confirmPassword } = await UsersSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
            });
            return;
        }
        // const existUsers = await User.findAll({
        //   where: {
        //     [Op.or]: [{ nickname }],
        //   },
        // });
        // if (existUsers.length) {
        //   res.status(400).send({
        //     errorMessage: "중복된 닉네임입니다.",
        //   });
        //   return;
        // }
        // if (password.indexOf(nickname) !== -1) {
        //   res.status(400).send({
        //     errorMessage: "사용할 수 없는 암호입니다",
        //   });
        //   return;
        // }
        await User.create({ nickname, password });

        res.status(201).send({});
    } catch (err) {
        res.status(400).send({
            errorMessage: "닉네임 영어나 숫자만 3자이상, 암호4자이상",
        });
    }
}

module.exports = { sign_up, sign_in, auth, sign_in_test, sign_up_test };
