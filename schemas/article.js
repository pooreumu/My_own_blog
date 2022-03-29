const mongoose = require("mongoose");

const articlesSchema = mongoose.Schema({
  articlesId: {
    type: Number,
    required: true,
    unique: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Writer: {
    type: String,
    required: true,
  },
  date: {
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
  likes: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Articles", articlesSchema);
