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
    PW: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    Contents: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Articles", articlesSchema);