const mongoose = require("mongoose");

const { Types } = mongoose;

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    color: {
      type: String,
      required: true,
    },
    modelYear: {
      type: Number,
      required: true,
    },
    seater: {
      type: Number,
      required: true,
    },
    powerHourse: {
      type: String,
      required: true,
    },
    KilometersIncluded: {
      type: Number,
      required: true,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    relatedVideo: {},
    carSilderImages: [
      { secure_url: { type: String }, public_id: { type: String } },
    ],
    carCardImage: { secure_url: { type: String }, public_id: { type: String } },
    categoryId: { type: Types.ObjectId, required: true, ref: "Category" },
    brandId: { type: Types.ObjectId, required: true, ref: "Brand" },
  },
  { timestamps: true }
);

const carModel = mongoose.model("Car", carSchema);

module.exports = carModel;
