const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const productRouter = require("./routes/productRoutes")
const userRouter = require("./routes/userRoutes")
const orderRouter = require("./routes/orderRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

dotenv.config()

// database connection
connectDB()

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "../uploads")))

app.use("/api/products", productRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)

app.get("/api/config/razorPay", (req, res) => {
  res.send(process.env.KEY_ID)
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  )
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode ${PORT}`)
})
