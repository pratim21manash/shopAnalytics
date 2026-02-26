import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ['grocery', "electronics", 'clothing', 'books', 'other'],
        default: "other"
    },
    costPrice: {
        type: Number,
        required: [true, "Cost price is required"],
        min: [0, "Cost price can not be negative"]
    },
    sellingPrice: {
        type: Number,
        required: [true, "Selling price is required"],
        min: [0, "Selling price cannot be negative"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is requied"],
        min: [0, "Stock can not be negative"],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 5,
        min: [1, "Threshold must be atleats 1"]
    }
}, { timestamps: true })

// Ensuring selling price is >= cost price
productSchema.pre('save', function(next){
    if(this.sellingPrice < this.costPrice){
        next(new Error("Selling price cannot be less than cost price"))
    }
    next()
})


// Virtual for profit margin
productSchema.virtual('profitMargin').get(function(){
    return((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2)
})


const Product = mongoose.model("Product", productSchema)
export default Product