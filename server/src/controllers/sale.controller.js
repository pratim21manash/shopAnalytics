import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import SaleModel from "../models/sale.model.js";
import { CatchError, TryError } from "../utils/error.js";

export const getSales = async (req, res) => {
    try {
        const sales = await SaleModel.find()
            .populate('product')
            .sort({ date: -1 })
        res.json(sales)
    }
    catch(err){
        CatchError(err, res)
    }
}



export const createSale = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { productId, quantity } = req.body

        //Get product with stock check
        const product = await ProductModel.findById(productId).session(session)

        if (!product) {
            throw TryError("Product not found", 404)
        }

        if (product.stock < quantity) {
            throw TryError(`Insufficient stock. Available: ${product.stock}`, 400)
        }

        //Calculate amount
        const totalAmount = product.sellingPrice * quantity
        const profit = (product.sellingPrice - product.costPrice) * quantity

        //Create sale
        const [sale] = await SaleModel.create([{
            product: productId,
            quantity,
            totalAmount,
            profit
        }], {session})

        //Update stock
        product.stock -= quantity
        await product.save({ session })

        //Commit transection
        await session.commitTransaction()
        session.endSession()

        //populate product details for response
        await sale.populate('product')

        res.status(201).json(sale)
    }
    catch(err){
        await session.abortTransaction()
        session.endSession()
        CatchError(err, res)
    }
}


export const getSalesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.body

        const query = {}

        if(startDate || endDate) {
            query.date = {}

            if (startDate) query.date.$gte = new Date(startDate)
            if (endDate) query.date.$lte = new Date(endDate)
        }

        const sales = await SaleModel.find(query)
            .populate('product')
            .sort({ date: -1 })
        
        res.json(sales)
    }
    catch(err){
        CatchError(err, res)
    }
}



export const getTodaySales = async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0 )

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const sales = await SaleModel.find({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('product')

        const total = sales.reduce((sum , sale) => sum + sale.totalAmount, 0)
        res.json({sales, total})
    }
    catch(err){
        CatchError(err, res)
    }
}