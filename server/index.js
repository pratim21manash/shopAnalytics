import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"

import productRoutes from "./src/routes/product.routes.js"
import saleRouter from "./src/routes/sale.route.js"

const app = express()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("MongoDb connection failed", err))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/sales', saleRouter)

//404 error handler
app.use((req,res) => {
    res.status(404).json({ message: "Route not found" })
})

app.listen(process.env.PORT || 8080 , () => {
    console.log(`Server is running on ${process.env.PORT}`)
})