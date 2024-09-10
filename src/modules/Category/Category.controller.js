const categoryModel = require("../../../Database/models/Category.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const { getOne, deleteOne } = require("../../utils/CodeHandler.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllCategories = async (req, res, next) => {
  try {
    const getAllCategories = await categoryModel.find({});

    if (!getAllCategories) {
      return First(res, "No Categorie requests found", 404, http.FAIL);
    }

    return Second(res, ["Done", getAllCategories], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetCategoryById = getOne(categoryModel);

const AddNewCategory = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name);
    const checkCategoryExisting = await categoryModel.findOne({
      name: req.body.name,
    });
    if (checkCategoryExisting) {
      return First(res, "This Category already exists", 409, http.FAIL);
    }

    // Upload image to Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `RentACarTesting/Category/${req.body.name}`,
      }
    );

    req.body.image = { secure_url, public_id };

    // Create new category
    const category = await categoryModel.create(req.body);

    return Second(res, ["Done", category], 201, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkCategoryExisting = await categoryModel.findById(id);
    if (!checkCategoryExisting) {
      return First(res, "This Category does not exist", 404, http.FAIL);
    }

    const checkCategoryName = await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });
    if (checkCategoryName) {
      return First(res, "This Category name already exists", 409, http.FAIL);
    }

    // If updating image
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `RentACarTesting/Category/${
            req.body.name || checkCategoryExisting.name
          }`,
        }
      );

      // Delete the old image if it exists
      if (checkCategoryExisting.image?.public_id) {
        await cloudinary.uploader.destroy(
          checkCategoryExisting.image.public_id
        );
      }
      req.body.image = { secure_url, public_id };
    }

    // Update category
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return Second(
      res,
      ["Category updated successfully", updatedCategory],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteCategory = deleteOne(categoryModel);

const SearchCategory = async (req, res, next) => {
  const { keyWord } = req.query;

  try {
    // Search by name or description, case-insensitive
    const searchResult = await categoryModel.find({
      $or: [
        { name: { $regex: keyWord, $options: "i" } },
        { description: { $regex: keyWord, $options: "i" } },
      ],
    });

    // If no categories are found, return a 404 response
    if (!searchResult) {
      return First(res, "No categories found", 404, http.FAIL);
    }

    // If categories are found, return the search results

    return Second(res, ["Search results", searchResult], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  SearchCategory,
  GetAllCategories,
  AddNewCategory,
  UpdateCategory,
  DeleteCategory,
  GetCategoryById,
};
