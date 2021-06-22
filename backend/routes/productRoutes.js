const path = require("path")
const express = require("express")
const multer = require("multer")
const router = new express.Router()
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} = require("../controllers/productController")
const { auth, admin } = require("../middleware/authMiddleware")

function checkFileType(file, cb) {
  const filetypes = /.jpg|.jpeg|.png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    return cb("Images only!")
  }
}

const upload = multer({
  fileFilter(req, file, cb) {
    checkFileType(file, cb)
  },
  limits: {
    fileSize: 1048576,
  },
})

router.get("/", getProducts)
router.get("/top", getTopProducts)
router.get("/:id", getProductById)
router.delete("/:id", auth, admin, deleteProduct)
router.post("/", auth, admin, upload.single("image"), createProduct)
router.put("/:id", auth, admin, upload.single("image"), updateProduct)
router.post("/:id/reviews", auth, createProductReview)

module.exports = router
