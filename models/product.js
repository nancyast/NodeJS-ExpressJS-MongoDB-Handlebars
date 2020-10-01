const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: Number,
  vat: String,
  discount: String,
  image: {
    smallSize: String,
    bigSize: String,
  },
  color: String,
  createdAt: String,
  rating: Number,
  category: [
    // parent reference
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      require: [true, 'Product must belong to a category'],
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
