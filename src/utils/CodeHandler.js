const cloudinary = require("./cloud.js");
const http = require("../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("./httperespons.js");

const deleteOne = (model) => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      // Find the document by ID
      const document = await model.findById(id);
      if (!document) {
        return First(res, "This document does not exist", 404, http.FAIL);
      }

      // If the document has a single image or car card image
      if (document.image?.public_id) {
        await cloudinary.uploader.destroy(document.image.public_id);
      }

      if (document.carCardImage?.public_id) {
        await cloudinary.uploader.destroy(document.carCardImage.public_id);
      }

      // If the document has multiple images (like car slider images)
      if (document.images?.length) {
        for (let i = 0; i < document.images.length; i++) {
          if (document.images[i]?.public_id) {
            await cloudinary.uploader.destroy(document.images[i].public_id);
          }
        }
      }

      if (document.carSilderImages?.length) {
        for (let i = 0; i < document.carSilderImages.length; i++) {
          if (document.carSilderImages[i]?.public_id) {
            await cloudinary.uploader.destroy(
              document.carSilderImages[i].public_id
            );
          }
        }
      }

      // Delete the document from the database
      await document.deleteOne();

      return Second(res, "Document deleted successfully", 200, http.SUCCESS);
    } catch (error) {
      console.error(error);
      return Third(res, "Internal Server Error", 500, http.ERROR);
    }
  };
};

const getOne = (model) => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      // Find the document by ID
      const document = await model.findById(id);
      if (!document) {
        return First(res, "This document does not exist", 404, http.FAIL);
      }

      // Return the document
      return Second(res, ["Success", document], 200, http.SUCCESS);
    } catch (error) {
      console.error(error);
      return Third(res, "Internal Server Error", 500, http.ERROR);
    }
  };
};

module.exports = {
  deleteOne,
  getOne,
};
