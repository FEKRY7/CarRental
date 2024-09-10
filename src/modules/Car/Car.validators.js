const joi = require("joi");
const {
  isValidObjectId,
} = require("../../middleware/validation.middleware.js");

const addNewCar = joi
  .object({
    name: joi.string().required(),
    color: joi.string().required(),
    modelYear: joi.number().required(),
    seater: joi.number().required(),
    powerHorse: joi.string().required(),
    categoryId: joi.string().custom(isValidObjectId).required(),
    brandId: joi.string().custom(isValidObjectId).required(),
    KilometersIncluded: joi.number().required(), 
    rentalCost: joi.number().required(), 
  })
  .required();

const updateCar = joi
  .object({
    name: joi.string(),
    color: joi.string(),
    modelYear: joi.number(),
    seater: joi.number(),
    powerHorse: joi.string(),
    categoryId: joi.string().custom(isValidObjectId), 
    brandId: joi.string().custom(isValidObjectId), 
    KilometersIncluded: joi.number(), 
    rentalCost: joi.number(), 
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const deleteCar = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

const getCarById = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();

module.exports = {
  addNewCar,
  updateCar,
  deleteCar,
  getCarById,
};
