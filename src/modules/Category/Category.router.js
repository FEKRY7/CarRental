const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");
const carRouter = require("../Car/Car.router.js");
const { fileUpload, allowedFiles } = require("../../utils/fileUpload.js");

const {
  addNewCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("./Category.validators.js");

const {
  SearchCategory,
  GetAllCategories,
  AddNewCategory,
  UpdateCategory,
  DeleteCategory,
  GetCategoryById,
} = require("./Category.controller.js");

router.use("/:id", carRouter);

router.get("/search", SearchCategory);

router
  .route("/")
  .get(GetAllCategories)
  .post(
    isAuthenticated,
    isAuthorized("Admin", "SuperAdmin"),
    fileUpload(allowedFiles.image).single("image"),
    validation(addNewCategory),
    AddNewCategory
  );

router
  .route("/:id")
  .put(
    isAuthenticated,
    isAuthorized("Admin", "SuperAdmin"),
    fileUpload(allowedFiles.image).single("image"),
    validation(updateCategory),
    UpdateCategory
  )
  .delete(
    isAuthenticated,
    isAuthorized("SuperAdmin"),
    validation(deleteCategory),
    DeleteCategory
  )
  .get(validation(getCategoryById), GetCategoryById);

module.exports = router;
