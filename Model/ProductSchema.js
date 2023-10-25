const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0  
    },
    image: {
        type: String,
        required: true
    },

    descr: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        min: 1,  
        max: 5   
    },
    productId: {
        type: String,
        unique: true,
        
    }
}, {
    timestamps: true  
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;



