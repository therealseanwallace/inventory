import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  description: { type: String, maxLength: 200 },
  url: { type: String, required: true },
});

export default mongoose.model("Category", CategorySchema);
