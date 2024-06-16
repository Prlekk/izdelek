const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: { type: Object, required: true },
  process: { type: Object, required: true },
  likes: { type: Number, default: 0, required: true },
  date: { type: Number, required: true },
  usersLiked: { type: Array, required: true }
});

module.exports = mongoose.model("Post", postSchema);

