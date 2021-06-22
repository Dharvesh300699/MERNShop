const express = require("express")
const router = new express.Router()
const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController")
const { auth, admin } = require("../middleware/authMiddleware")

router.post("/", registerUser)
router.get("/", auth, admin, getUsers)
router.post("/login", authUser)
router.get("/profile", auth, getUserProfile)
router.put("/profile", auth, updateUserProfile)
router.delete("/:id", auth, admin, deleteUser)
router.get("/:id", auth, admin, getUserById)
router.put("/:id", auth, admin, updateUser)

module.exports = router
