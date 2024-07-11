import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] },
  imagePath: { type: String },
  filePath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const todoModel = mongoose.model("Todo", TodoSchema);

export default todoModel;
