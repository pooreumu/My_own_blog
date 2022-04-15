const jwt = require("jsonwebtoken");
const { User } = require("../models");
const token_key = process.env.JWT_KEY;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
        res.status(401).json({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
    try {
        const myToken = verifyToken(tokenValue);
        if (myToken === "jwt expired") {
            const userInfo = jwt.decode(tokenValue, token_key);
            const userId = userInfo.userId;
            User.findByPk(userId).then((user) => {
                const refreshToken = user.refreshToken;
                const myRefreshToken = verifyToken(refreshToken);
                if (myRefreshToken === "jwt expired") {
                    res.status(401).json({
                        errorMessage: "로그인 후 사용하세요",
                    });
                } else {
                    const myNewToken = jwt.sign({ userId: user.userId }, token_key, {
                        expiresIn: "10s",
                    });
                    res.send({ message: "new token", myNewToken });
                }
            });
        } else {
            User.findByPk(userId).then((user) => {
                res.locals.user = user;
                next();
            });
        }
    } catch (error) {
        res.status(401).json({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
};

function verifyToken(token) {
    try {
        return jwt.verify(token, token_key);
    } catch (error) {
        return error.message;
    }
}
