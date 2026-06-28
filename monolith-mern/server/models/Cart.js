const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:    { type: String, required: true },
  price:   { type: Number, required: true },
  qty:     { type: Number, required: true, min: 1, default: 1 },
  image:   { type: String },
  color:   { type: String },
  stock:   { type: Number },
});

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

cartSchema.virtual('total').get(function () {
  return this.items.reduce((s, i) => s + i.price * i.qty, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
