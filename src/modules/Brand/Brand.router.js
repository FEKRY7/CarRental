const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");
const { fileUpload, allowedFiles } = require("../../utils/fileUpload.js");

const {
  getBrandById,
  addNewBrand,
  updateBrand,
  deleteBrand,
} = require("./Brand.validators.js");

const {
  GetAllBrands,
  GetBrandById,
  SearchBrand,
  AddNewBrand,
  UpdateBrand,
  DeleteBrand,
} = require("./Brand.controller.js");

const carRouter = require("../Car/Car.router.js");

router.use('/:id',carRouter)

router.get("/", GetAllBrands);

router.get("/search", SearchBrand);

router.post(
  "/",
  isAuthenticated,
  isAuthorized("Admin", "SuperAdmin"),
  fileUpload(allowedFiles.image).single("image"),
  validation(addNewBrand),
  AddNewBrand
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("Admin", "SuperAdmin"),
  fileUpload(allowedFiles.image).single("image"),
  validation(updateBrand),
  UpdateBrand
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("SuperAdmin"),
  validation(deleteBrand),
  DeleteBrand
);

router.get("/:id",validation(getBrandById), GetBrandById);

module.exports = router;
