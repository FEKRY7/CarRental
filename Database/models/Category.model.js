const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, unique: true },
    description: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true, lowercase: true },
    image: { secure_url: { type: String }, public_id: { type: String } },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.virtual("Cars", {
  localField: "_id",
  foreignField: "CategoryId",
  ref: "Car",
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
