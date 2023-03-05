const asyncHandler = require("express-async-handler");
const Casal = require("../models/casalModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Prouct
const createCasal = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could nao be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Casal
  const casal = await Casal.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(casal);
});

// Get all Casals
const getCasais = asyncHandler(async (req, res) => {
  const casais = await Casal.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(casais);
});

// Get single Casal
const getCasal = asyncHandler(async (req, res) => {
  const casal = await Casal.findById(req.params.id);
  // if Casal doesnt exist
  if (!casal) {
    res.status(404);
    throw new Error("Casal not found");
  }
  // Match Casal to its user
  if (casal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(casal);
});

// Delete Casal
const deleteCasal = asyncHandler(async (req, res) => {
  const casal = await Casal.findById(req.params.id);
  // if Casal doesnt exist
  if (!casal) {
    res.status(404);
    throw new Error("Casal not found");
  }
  // Match Casal to its user
  if (casal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await casal.remove();
  res.status(200).json({ message: "Casal deleted." });
});

// Update Casal
const updateCasal = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const casal = await Casal.findById(id);

  // if Casal doesnt exist
  if (!casal) {
    res.status(404);
    throw new Error("Casal not found");
  }
  // Match Casal to its user
  if (casal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Imagem could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Casal
  const updatedCasal = await Casal.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? casal?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedCasal);
});

module.exports = {
  createCasal: createCasal,
  getCasais: getCasais,
  getCasal: getCasal,
  deleteCasal: deleteCasal,
  updateCasal: updateCasal,
};
