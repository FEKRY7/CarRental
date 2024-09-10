const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const {
  createBookingRequest,
  changeBookingRequestStatus,
  deleteBookingRequest,
  getBookingById,
} = require("./Booking.validators.js");

const {
  CreateBookingRequest,
  GetAllBookingRequests,
  ChangeBookingRequestStatus,
  DeleteBookingRequest,
  GetBookingById,
} = require("./Booking.controller.js");

router
  .route("/")
  .post(validation(createBookingRequest), CreateBookingRequest)
  .get(isAuthenticated, isAuthorized("Admin"), GetAllBookingRequests);
router
  .route("/:bookingId")
  .patch(
    isAuthenticated,
    isAuthorized("Admin"),
    validation(changeBookingRequestStatus),
    ChangeBookingRequestStatus
  )
  .delete(
    isAuthenticated,
    isAuthorized("Admin"),
    validation(deleteBookingRequest),
    DeleteBookingRequest
  )
  .get(
    isAuthenticated,
    isAuthorized("Admin"),
    validation(getBookingById),
    GetBookingById
  );

module.exports = router;
