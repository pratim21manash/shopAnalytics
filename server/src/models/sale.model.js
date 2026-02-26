import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be atleast 1"]
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, "Total amount cannot be negative"]
    },
    profit: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})


saleSchema.index({ date: -1 })
saleSchema.index({ product: 1, date: -1 })

const Sale = mongoose.model("Sale", saleSchema)
export default Sale