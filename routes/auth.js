const express = require("express");
const router = express.Router();
const authCtl = require("../controller/auth");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/signup", authCtl.sign_up);

router.post("/auth", authCtl.sign_in);

router.get("/users/me", authMiddleware, authCtl.auth);

module.exports = router;
