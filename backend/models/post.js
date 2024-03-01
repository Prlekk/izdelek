const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: { type: Object, required: true },
  process: { type: Object, required: true }
});

module.exports = mongoose.model("Post", postSchema);