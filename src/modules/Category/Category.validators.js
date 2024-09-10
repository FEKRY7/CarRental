const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const addNewCategory = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required()
  })
  .required();

const updateCategory = joi
  .object({
    name: joi.string(),
    description: joi.string(),
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const deleteCategory = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getCategoryById = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

module.exports = {
  addNewCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
