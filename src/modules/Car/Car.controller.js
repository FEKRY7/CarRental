const brandModel = require("../../../Database/models/Brand.model.js");
const carModel = require("../../../Database/models/Car.model.js");
const categoryModel = require("../../../Database/models/Category.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const { getOne, deleteOne } = require("../../utils/CodeHandler.js");
const { ApiFeatures } = require("../../utils/api.features.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllCars = async (req, res, next) => {
  try {
    const filter = {};

    // Filter by category ID if provided
    if (req.params.id) {
      filter.categoryId = req.params.id;
    }

    // Use API features for filtering, pagination, etc.
    const apiFeatures = new ApiFeatures(carModel.find(filter), req.query)
      .pagination()
      .filter()
      .search()
      .sort()
      .select();

    // Retrieve cars based on the applied features
    const cars = await apiFeatures.mongooseQuery;

    if (cars.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    // If cars are found, return them in the response
    return Second(res, ["Done", cars], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetCarById = getOne(carModel);

const AddNewCar = async (req, res, next) => {
  try {
    const {
      name,
      color,
      modelYear,
      seater,
      powerHourse,
      categoryId,
      brandId,
      KilometersIncluded,
      rentalCost,
    } = req.body;
    let slug = slugify(name);

    const isExistCategory = await categoryModel.findById(categoryId);
    if (!isExistCategory)
      return First(res, "Cannot Find This Category", 404, http.FAIL);

    const isExistBrand = await brandModel.findById(brandId);
    if (!isExistBrand)
      return First(res, "Cannot Find This Brand", 404, http.FAIL);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      { folder: `RentACarTesting/Car/${slug}-${color}/mainImage` }
    );

    const silderImagesPaths = await Promise.all(
      req.files.images.map(async (image) => {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          image.path,
          { folder: `RentACarTesting/Car/${slug}-${color}/sliderImages` }
        );
        return { secure_url, public_id };
      })
    );

    const car = await carModel.create({
      name,
      slug,
      color,
      modelYear,
      seater,
      powerHourse,
      categoryId,
      brandId,
      KilometersIncluded,
      rentalCost,
      carSilderImages: silderImagesPaths,
      carCardImage: { secure_url, public_id },
    });
    return Second(res, ["Done", car], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isCarExist = await carModel.findById(id);
    if (!isCarExist) return First(res, "Not Found", 404, http.FAIL);

    if (req.body?.categoryId) {
      const isExistCategory = await categoryModel.findById(req.body.categoryId);
      if (!isExistCategory)
        return First(res, "Cannot Find This Category", 404, http.FAIL);
    }

    if (req.body?.brandId) {
      const isExistBrand = await brandModel.findById(req.body.brandId);
      if (!isExistBrand)
        return First(res, "Cannot Find This Brand", 404, http.FAIL);
    }

    if (req.body?.name) {
      req.body.slug = slugify(req.body.name);
    }

    if (req.files.image) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `RentACarTesting/Car/${req.body.slug || isCarExist.slug}-${
            req.body.color || isCarExist.color
          }/mainImage`,
        }
      );
      if (isCarExist.carCardImage?.public_id) {
        await cloudinary.uploader.destroy(isCarExist.carCardImage.public_id);
      }
      req.body.carCardImage = { secure_url, public_id };
    }

    if (req.files.images) {
      const silderImagesPaths = await Promise.all(
        req.files.images.map(async (image) => {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            image.path,
            {
              folder: `RentACarTesting/Car/${
                req.body.slug || isCarExist.slug
              }-${req.body.color || isCarExist.color}/sliderImages`,
            }
          );
          return { secure_url, public_id };
        })
      );
      if (isCarExist.carSilderImages) {
        await Promise.all(
          isCarExist.carSilderImages.map(async (image) => {
            await cloudinary.uploader.destroy(image.public_id);
          })
        );
      }
      req.body.carSilderImages = silderImagesPaths;
    }

    const car = await carModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!car) {
      return First(res, "Car Not Found", 404, http.FAIL);
    }

    return Second(res, ["Done", car], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteCarById = deleteOne(carModel);

const OrderByDate = async (req, res, next) => {
  try {
    const result = await carModel.find().sort({ createdAt: 1 });

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    return Second(res, ["Done", result], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const OrderByPrice = async (req, res, next) => {
  try {
    const result = await carModel.find().sort({ rentalCost: 1 });

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    return Second(res, ["Done", result], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const OrderByPriceDesc = async (req, res, next) => {
  try {
    const result = await carModel.find().sort({ rentalCost: -1 });

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    return Second(res, ["Done", result], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  GetAllCars,
  GetCarById,
  AddNewCar,
  UpdateCarById,
  DeleteCarById,
  OrderByDate,
  OrderByPrice,
  OrderByPriceDesc,
};
