const express = require('express');
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — place order from cart
router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress || !paymentMethod)
    return res.status(400).json({ message: 'Shipping address and payment method required' });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  // Validate stock and compute prices
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.qty)
      return res.status(400).json({ message: `${item.name} is out of stock` });
  }

  const subtotal     = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const tax          = parseFloat((subtotal * 0.08).toFixed(2));
  const totalPrice   = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(i => ({
      product: i.product, name: i.name, price: i.price,
      qty: i.qty, image: i.image, color: i.color,
    })),
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    tax,
    totalPrice,
  });

  // Decrement stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// GET /api/orders/my — user's own orders
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders — all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not allowed' });
  res.json(order);
});

// PUT /api/orders/:id/pay — mark as paid (mock payment)
router.put('/:id/pay', protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not allowed' });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = {
    id:         `PAY-${Date.now()}`,
    status:     'COMPLETED',
    updateTime: new Date().toISOString(),
    email:      req.user.email,
  };
  await order.save();
  res.json(order);
});

// PUT /api/orders/:id/status — update status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === 'delivered' ? { deliveredAt: Date.now() } : {}) },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

module.exports = router;
