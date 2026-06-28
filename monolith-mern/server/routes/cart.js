const express = require('express');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/cart
router.get('/', protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
});

// POST /api/cart — add item
router.post('/', protect, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < 1) return res.status(400).json({ message: 'Out of stock' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.items.push({
      product: product._id,
      name:    product.name,
      price:   product.price,
      qty:     Math.min(qty, product.stock),
      image:   product.image,
      color:   product.color,
      stock:   product.stock,
    });
  }
  await cart.save();
  res.json(cart);
});

// PUT /api/cart/:productId — update qty
router.put('/:productId', protect, async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });

  if (qty <= 0) {
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  } else {
    item.qty = Math.min(qty, item.stock || 99);
  }
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart/:productId — remove item
router.delete('/:productId', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart — clear cart
router.delete('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) { cart.items = []; await cart.save(); }
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
