const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

brandSchema.virtual("Cars", {
  localField: "_id",
  foreignField: "brandId",
  ref: "Car",
});

const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
