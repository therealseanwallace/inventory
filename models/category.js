import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  description: { type: String, maxLength: 200 }
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/category/${this.id}`;
});

export default mongoose.model("Category", CategorySchema);
