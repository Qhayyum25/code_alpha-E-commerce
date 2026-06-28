const express  = require('express');
const Product  = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/products — list with filter/search/pagination
router.get('/', async (req, res) => {
  const { category, search, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  if (category && category !== 'all') query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  let sortObj = { createdAt: -1 };
  if (sort === 'price-low')  sortObj = { price: 1 };
  if (sort === 'price-high') sortObj = { price: -1 };
  if (sort === 'rating')     sortObj = { rating: -1 };
  if (sort === 'name')       sortObj = { name: 1 };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  const products = await Product.find({ featured: true }).limit(6);
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products — admin create
router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:id — admin update
router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// DELETE /api/products/:id — admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

// POST /api/products/:id/reviews — add a review
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'You already reviewed this product' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.updateRating();
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = router;
