const mongoose = require("mongoose");

const connect = () => {
  const mongoId = process.env.MONGO_ID;
  const mongoPw = process.env.MONGO_PW;
  mongoose
    .connect(`mongodb://${mongoId}:${mongoPw}@localhost:27017/MyOwnBlog?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connect;
