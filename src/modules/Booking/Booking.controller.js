const bookingModel = require("../../../Database/models/Booking.model.js");
const carModel = require("../../../Database/models/Car.model.js");
const { getOne, deleteOne } = require("../../utils/CodeHandler.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllBookingRequests = async (req, res, next) => {
  try {
    // Retrieve all booking requests
    const GetAllBooking = await bookingModel.find();

    // If no booking GetAllBooking are found, return a 404 response
    if (!GetAllBooking) {
      return First(res, "No booking requests found", 404, http.FAIL);
    }

    // Return the booking requests if found
    return Second(res, ["Done", GetAllBooking], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetBookingById = getOne(bookingModel);

const CreateBookingRequest = async (req, res, next) => {
  try {
    const {
      carId,
      fullName,
      mobilePhone,
      specialRequest,
      rentalStartDate,
      rentalEndDate,
    } = req.body;

    const isExistCar = await carModel.findById(carId);
    if (!isExistCar)
      return First(res, "Cannot find this car, check the ID", 404, http.FAIL);

    const bookingRequest = await bookingModel.create({
      carId,
      fullName,
      mobilePhone,
      specialRequest,
      rentalStartDate,
      rentalEndDate,
    });

    return Second(
      res,
      ["Request sent. Once we receive it, we will contact you", bookingRequest],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteBookingRequest = deleteOne(bookingModel);

const ChangeBookingRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const checkRequest = await bookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!checkRequest) {
      return First(res, "Invalid request", 404, http.FAIL);
    }

    return Second(
      res,
      ["Request updated successfully", checkRequest],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateBookingRequest,
  GetAllBookingRequests,
  ChangeBookingRequestStatus,
  DeleteBookingRequest,
  GetBookingById,
};
