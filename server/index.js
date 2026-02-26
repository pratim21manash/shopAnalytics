import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("MongoDb connection failed", err))

//Health check
app.get('/health', (req, res) => {
    res.json({status: "OK", timestamp: new Date()})
})

//404 error handler
app.use((req,res) => {
    res.status(404).json({ message: "Route not found" })
})

app.listen(process.env.PORT || 8080 , () => {
    console.log("Server is running")
})