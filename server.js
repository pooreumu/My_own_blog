const app = require("./app");
// const fs = require("fs");
// const https = require("https");

// const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`, "utf8");
// const certuficate = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`, "utf8");
// const ca = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/chain.pem`, "utf8");

// const credentials = {
//     key: privateKey,
//     cert: certuficate,
//     ca: ca,
// };

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(443, () => {
//     console.log("HTTPS SERVER RUNNING ON PORT 443");
// });

app.listen(process.env.SERVER_PORT, () => {
    console.log(process.env.SERVER_PORT, "포트로 서버가 켜졌어요!");
});
