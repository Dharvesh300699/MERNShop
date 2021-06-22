const express = require("express");
const router = new express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  createRazorOrder,
  orderSuccess,
  getOrders,
} = require("../controllers/orderController");
const { auth, admin } = require("../middleware/authMiddleware");

router.post("/", auth, addOrderItems);
router.get("/", auth, admin, getOrders);
router.get("/myorders", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/pay", auth, updateOrderToPaid);
router.put("/:id/deliver", auth, admin, updateOrderToDelivered);
router.get("/:id/razorOrder", auth, createRazorOrder);
router.post("/success", auth, orderSuccess);

module.exports = router;
