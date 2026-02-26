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
        
        const product = await ProductModel.findById(productId).session(session)

        if(!product){
            throw TryError("Product not found", 404)
        }

        if(product.stock < quantity){
            throw TryError(`Insufficient stock. Available: ${product.stock}`, 400)
        }

        //Calculate amount
        const totalAmount = product.sellingPrice * quantity
        const profit = (product.sellingPrice - product.costPrice) * quantity

        //Create sale
        const sale = await SaleModel.create([{
            product: productId,
            quantity,
            totalAmount,
            profit
        }], {session})

        //Update stock
        product.stock -= quantity
        await product.save({ session })

        //commit transection
        await session.commitTransaction()
        session.endSession()

        res.status(201).json(sale[0])
    }
    catch(err){
        await session.abortTransaction()
        session.endSession()
        CatchError(err, res)
    }
}