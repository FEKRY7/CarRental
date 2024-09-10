const brandModel = require("../../../Database/models/Brand.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const { getOne, deleteOne } = require("../../utils/CodeHandler.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllBrands = async (req, res, next) => {
  try {
    const GetAllBrands = await brandModel.find({});

    if (!GetAllBrands) {
      return First(res, "No Brand requests found", 404, http.FAIL);
    }

    return Second(res, ["Success", GetAllBrands], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetBrandById = getOne(brandModel);

const AddNewBrand = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);

    // Check if brand already exists
    const checkBrandExisting = await brandModel.findOne({
      name: req.body.name,
    });
    if (checkBrandExisting) {
      return First(res, "This Brand already exists", 409, http.FAIL);
    }

    // Upload image to Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `RentACarTesting/Brand/${req.body.name}`,
      }
    );
    req.body.image = { secure_url, public_id };

    // Create new brand
    const brand = await brandModel.create(req.body);

    return Second(
      res,
      ["Brand created successfully", brand],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateBrand = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the brand exists
    const checkBrandExisting = await brandModel.findById(id);
    if (!checkBrandExisting) {
      return First(res, "This Brand does not exist", 404, http.FAIL);
    }

    // Check if brand name already exists (excluding the current brand)
    const checkBrandName = await brandModel.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });
    if (checkBrandName) {
      return First(
        res,
        `Brand name "${req.body.name}" already exists`,
        409,
        http.FAIL
      );
    }

    // If a new file is uploaded, replace the old image
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `RentACarTesting/Brand/${
            req.body.name || checkBrandExisting.name
          }`,
        }
      );

      // Delete the old image from Cloudinary
      if (checkBrandExisting.image?.public_id) {
        await cloudinary.uploader.destroy(checkBrandExisting.image.public_id);
      }
      req.body.image = { secure_url, public_id };
    }

    // Update the brand
    const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand) {
      return First(res, "No Brand requests found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Brand updated successfully", updatedBrand],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteBrand = deleteOne(brandModel);

const SearchBrand = async (req, res, next) => {
  const { keyWord } = req.query;

  try {
    const searchResult = await brandModel.find({
      $or: [
        { name: { $regex: keyWord, $options: "i" } }, // Case-insensitive search
        { description: { $regex: keyWord, $options: "i" } },
      ],
    });
    if (!searchResult) {
      return First(res, "No Brands found", 404, http.FAIL);
    }

    return Second(res, ["Search completed", searchResult], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  GetAllBrands,
  GetBrandById,
  SearchBrand,
  AddNewBrand,
  UpdateBrand,
  DeleteBrand,
};
