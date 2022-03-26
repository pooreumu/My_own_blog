const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  articlesId: {
    type: Number,
    required: true,
  },
  postsId: {
    type: Number,
    require: true,
  },
  Writer: {
    type: String,
    required: true,
  },
  Contents: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
