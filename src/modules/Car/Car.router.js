const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");
const { fileUpload, allowedFiles } = require("../../utils/fileUpload.js");

const {
  addNewCar,
  updateCar,
  deleteCar,
  getCarById,
} = require("./Car.validators.js");

const {
  GetAllCars,
  GetCarById,
  AddNewCar,
  UpdateCarById,
  DeleteCarById,
  OrderByDate,
  OrderByPrice,
  OrderByPriceDesc,
} = require("./Car.controller.js");

router
  .route("/")
  .get(GetAllCars)
  .post(
    isAuthenticated,
    isAuthorized("Admin", "SuperAdmin"),
    fileUpload(allowedFiles.image).fields([
      {
        name: "image",
        maxCount: "1",
      },
      { name: "images", maxCount: "10" },
    ]),
    validation(addNewCar),
    AddNewCar
  );

router
  .route("/:id")
  .delete(
    isAuthenticated,
    isAuthorized("SuperAdmin"),
    validation(deleteCar),
    DeleteCarById
  )
  .put(
    isAuthenticated,
    isAuthorized("Admin", "SuperAdmin"),
    fileUpload(allowedFiles.image).fields([
      {
        name: "image",
        maxCount: "1",
      },
      { name: "images", maxCount: "10" },
    ]),
    validation(updateCar),
    UpdateCarById
  )
  .get(validation(getCarById), GetCarById);

router.get("/orderby=date", OrderByDate);
router.get("/orderby=price", OrderByPrice);
router.get("/orderby=price-desc", OrderByPriceDesc);

module.exports = router;
