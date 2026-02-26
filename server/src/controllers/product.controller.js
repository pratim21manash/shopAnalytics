import Product from "../models/product.model.js";
import { CatchError, TryError } from "../utils/error.js";

export const getProducts = async (req,res) => {
    try {
        const products = await Product.find().sort({createdAt: -1})
        res.json(getProducts)
    }
    catch(err){
        CatchError(err, res)
    }
}


export const getProduct = async(req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product){
            throw TryError("Product not found", 404)
        }
    }
    catch(err){
        CatchError(err, res)
    }
}


export const createProduct = async (req,res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    }
    catch(err){
        CatchError(err, res)
    }
}


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!product){
            throw TryError("Product not found", 404)
        }

        res.json(product)
    }
    catch(err){
        CatchError(err, res)
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)

        if (!product) {
            throw TryError("Product not found", 404)
        }

        res.json({ message: "Product deleted successfulllly" })
    }
    catch(err){
        CatchError(err, res)
    }
}