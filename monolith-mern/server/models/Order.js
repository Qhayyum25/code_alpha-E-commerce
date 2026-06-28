const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, min: 1 },
  image:    { type: String },
  color:    { type: String },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name:    { type: String, required: true },
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    zip:     { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, default: 'Card' },
  paymentResult: {
    id:         String,
    status:     String,
    updateTime: String,
    email:      String,
  },
  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, required: true, default: 0 },
  tax:          { type: Number, required: true, default: 0 },
  totalPrice:   { type: Number, required: true },
  isPaid:       { type: Boolean, default: false },
  paidAt:       { type: Date },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
