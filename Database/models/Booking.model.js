const mongoose = require("mongoose");

const { Types } = mongoose;

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowercase: true,
    },
    mobilePhone: {
      type: String,
      required: true,
    },
    specialRequest: String,
    rentalStartDate: {
      type: Date,
      required: true,
      min: Date.now(),
    },
    rentalEndDate: {
      type: Date,
      required: true,
      min: Date.now(),
    },
    carId: {
      type: Types.ObjectId,
      ref: "Car",
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Received"],
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;
