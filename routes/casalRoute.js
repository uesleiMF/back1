const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createCasal,
  getCasais,
  getCasal,
  deleteCasal,
  updateCasal,
} = require("../controllers/casalController");
const { upload } = require("../utils/fileUpload");

router.post("/", protect, upload.single("image"), createCasal);
router.patch("/:id", protect, upload.single("image"), updateCasal);
router.get("/", protect, getCasais);
router.get("/:id", protect, getCasal);
router.delete("/:id", protect, deleteCasal);

module.exports = router;
