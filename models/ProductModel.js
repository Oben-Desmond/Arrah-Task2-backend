const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;