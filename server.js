const app = require("./app");

app.listen(process.env.SERVER_PORT, () => {
  console.log(process.env.SERVER_PORT, "포트로 서버가 켜졌어요!");
});
