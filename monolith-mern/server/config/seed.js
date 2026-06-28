const User    = require('../models/User');
const Product = require('../models/Product');

const MOCK_PRODUCTS = [
  // HOME
  {
    name: 'Editor Lamp', category: 'home', price: 320, stock: 18, featured: true, color: '#c2b59b',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
    description: 'A timeless arc lamp with a weighted marble base and brushed brass arm. Warm 2700K LED. Height adjustable 140–180 cm.'
  },
  {
    name: 'Atlas Coffee Table', category: 'home', price: 540, stock: 7, featured: true, color: '#a89880',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
    description: 'Solid white oak top on powder-coated steel legs. 120×60 cm. Ships fully assembled.'
  },
  {
    name: 'Linen Throw', category: 'home', price: 89, stock: 42, featured: false, color: '#d6c9b5',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop',
    description: 'Stone-washed 100% linen throw, 150×200 cm. Available in four muted naturals.'
  },
  {
    name: 'Ceramic Vase Set', category: 'home', price: 145, stock: 22, featured: false, color: '#e8ddd0',
    image: 'https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?w=600&auto=format&fit=crop',
    description: 'Set of three hand-thrown stoneware vases. Matte glaze, varying heights 15–35 cm.'
  },
  {
    name: 'Oak Bookshelf', category: 'home', price: 890, stock: 5, featured: true, color: '#b8a080',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
    description: 'Solid American white oak, 5-shelf, wall-anchored. 80×30×200 cm.'
  },
  {
    name: 'Wool Area Rug', category: 'home', price: 420, stock: 10, featured: false, color: '#d0c4b0',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
    description: '100% New Zealand wool, hand-tufted. 200×300 cm. Low pile, easy to clean.'
  },

  // FASHION
  {
    name: 'Raw Denim Jacket', category: 'fashion', price: 2890, stock: 12, featured: true, color: '#3a4a60',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    description: '14 oz Japanese selvedge denim. Unlined, unfaded — breaks in with you. Sizes XS–XL.'
  },
  {
    name: 'Merino Turtleneck', category: 'fashion', price: 240, stock: 30, featured: false, color: '#8a8070',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop',
    description: 'Ultra-fine 17.5 micron merino wool. Ribbed cuffs and hem. Machine washable.'
  },
  {
    name: 'Minimal Sneaker', category: 'fashion', price: 190, stock: 25, featured: true, color: '#e0d8cc',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
    description: 'Full-grain leather upper, crepe rubber sole, unlined. Ages beautifully.'
  },
  {
    name: 'Canvas Tote', category: 'fashion', price: 65, stock: 55, featured: false, color: '#c8c0b0',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop',
    description: '16 oz waxed canvas, bridle leather handles. Internal zip pocket. 38×42 cm.'
  },
  {
    name: 'Linen Shirt', category: 'fashion', price: 175, stock: 40, featured: false, color: '#dcd4c4',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop',
    description: 'Pre-washed 100% European linen. Relaxed fit, hidden button placket. Sizes XS–XXL.'
  },
  {
    name: 'Wool Overcoat', category: 'fashion', price: 1450, stock: 8, featured: true, color: '#2e2e2e',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop',
    description: 'Double-faced Italian wool, half-canvas construction. Single-breasted, 3 buttons.'
  },

  // ELECTRONICS
  {
    name: 'Pro Studio Monitor', category: 'electronics', price: 1200, stock: 6, featured: true, color: '#2a2a2a',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
    description: 'Near-field reference monitor, 5" woofer, 1" tweeter. Flat 52 Hz–22 kHz frequency response.'
  },
  {
    name: 'Wireless Earbuds', category: 'electronics', price: 280, stock: 20, featured: false, color: '#e8e4de',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop',
    description: 'Dual-driver hybrid, ANC, 8-hr battery, 30-hr case. IPX5 water resistant.'
  },
  {
    name: 'Slim Charging Pad', category: 'electronics', price: 65, stock: 50, featured: false, color: '#555555',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop',
    description: '15W Qi2 wireless charger, 4 mm profile. Qi-compatible with all devices.'
  },
  {
    name: 'Mechanical Keyboard', category: 'electronics', price: 320, stock: 15, featured: true, color: '#f0ece4',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
    description: 'Aluminum chassis, hot-swap switches, PBT keycaps. USB-C + Bluetooth 5.0.'
  },
  {
    name: 'Desk Organiser Hub', category: 'electronics', price: 140, stock: 28, featured: false, color: '#3a3a3a',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop',
    description: '4× USB-A, 2× USB-C PD 100W, Ethernet, 3.5 mm. Aluminum brushed top. 30 cm.'
  },
  {
    name: 'Smart LED Panel', category: 'electronics', price: 390, stock: 9, featured: false, color: '#d4e0f0',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    description: 'Matter-compatible, 60×60 cm modular LED panel. 16M colours, 2700–6500K tunable white.'
  },

  // ACCESSORIES
  {
    name: 'Leather Card Wallet', category: 'accessories', price: 85, stock: 60, featured: false, color: '#8b6040',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    description: 'Full-grain vegetable-tanned leather. Holds 6 cards + cash slot. Slims down with use.'
  },
  {
    name: 'Titanium Watch', category: 'accessories', price: 950, stock: 11, featured: true, color: '#909090',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    description: 'Grade 5 titanium case 40 mm, sapphire crystal, 200 m water resistance. Swiss movement.'
  },
  {
    name: 'Merino Beanie', category: 'accessories', price: 55, stock: 70, featured: false, color: '#606060',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop',
    description: 'Extra-fine 18 micron merino. Single-ply, ribbed. One size, four colours.'
  },
  {
    name: 'Brass Key Holder', category: 'accessories', price: 45, stock: 80, featured: false, color: '#c8a840',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&auto=format&fit=crop',
    description: 'Solid brass, expandable up to 8 keys. Quieter and neater than a keyring.'
  },
];

async function seedDB() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(MOCK_PRODUCTS);
      console.log(`✅  Seeded ${MOCK_PRODUCTS.length} products`);
    }

    const adminExists = await User.findOne({ email: 'admin@monolith.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@monolith.com', password: 'admin123', role: 'admin' });
      console.log('✅  Admin user created — admin@monolith.com / admin123');
    }

    const demoExists = await User.findOne({ email: 'demo@monolith.com' });
    if (!demoExists) {
      await User.create({ name: 'Demo User', email: 'demo@monolith.com', password: 'demo1234', role: 'user' });
      console.log('✅  Demo user created — demo@monolith.com / demo1234');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = { seedDB };
