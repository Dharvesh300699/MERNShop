const dotenv = require("dotenv")
const cloudinary = require("cloudinary").v2
const sharp = require("sharp")
const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel.js")

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await cloudinary.uploader.destroy(product.public_id)
    await product.remove()
    res.json({ message: "Product removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Image is required!")
  }
  const { name, description, category, price, brand, countInStock } = req.body

  const public_id = `${req.file.originalname.split(".")[0]}_${Date.now()}`

  const imageBuffer = await sharp(req.file.buffer)
    .resize({ width: 640, height: 510 })
    .jpeg({ mozjpeg: true })
    .toBuffer()

  const base64URI = `data:image/${
    req.file.originalname.split(".")[1]
  };base64,${imageBuffer.toString("base64")}`

  const result = await cloudinary.uploader.upload(base64URI, {
    folder: "ecommerce",
    public_id: public_id,
  })

  const product = new Product({
    user: req.user._id,
    name,
    description,
    category,
    price,
    brand,
    countInStock,
    image: result.secure_url,
    public_id: result.public_id,
  })

  await product.save()

  res.status(201).json({ message: "Product created successfully" })
})

// @desc    Update a product
// @route   /api/products/:id
// @access  Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  } else {
    const allowedUpdates = [
      "name",
      "price",
      "description",
      "brand",
      "category",
      "countInStock",
    ]

    const updates = Object.keys(req.body)
    console.log(updates)
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
      res.status(400)
      throw new Error("Invalid updates")
    }

    updates.forEach((update) => {
      product[update] = req.body[update]
    })

    if (req.file) {
      const public_id = `${req.file.originalname.split(".")[0]}_${Date.now()}`

      const imageBuffer = await sharp(req.file.buffer)
        .resize({ width: 640, height: 510 })
        .jpeg({ mozjpeg: true })
        .toBuffer()

      const base64URI = `data:image/${
        req.file.originalname.split(".")[1]
      };base64,${imageBuffer.toString("base64")}`

      const result = await cloudinary.uploader.upload(base64URI, {
        folder: "ecommerce",
        public_id: public_id,
      })

      await cloudinary.uploader.destroy(product.public_id)

      product.image = result.secure_url
      product.public_id = result.public_id
    }

    await product.save()
    res.json({ message: "Product updated" })
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product already reviewed")
    }

    const allowedUpdates = ["rating", "comment"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
      res.status(400)
      throw new Error("Invalid updates")
    }

    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.json({ message: "Review added" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
