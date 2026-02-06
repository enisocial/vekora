require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const heroVideoRoutes = require('./routes/heroVideo');
const whatsappRoutes = require('./routes/whatsapp-simple');
const visitorsRoutes = require('./routes/visitors');
const catalogRoutes = require('./routes/catalog');
const facebookConversionsRoutes = require('./routes/facebookConversions');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://vekora-f8qv-ayyzxhg7a-tivi-ms-projects.vercel.app', 'https://vekora.vercel.app', 'https://vekora-b5w4.vercel.app', 'https://vekora.netlify.app', 'https://vekora-pngm4cloq-tivi-ms-projects.vercel.app', 'https://vekora.store']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Middleware pour parser text/plain comme JSON
app.use('/api', (req, res, next) => {
  if (req.headers['content-type'] === 'text/plain;charset=UTF-8') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API works!' });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/hero-video', heroVideoRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/visitors', visitorsRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/fb-conversions', facebookConversionsRoutes);

// 404 for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Vekora API server running on port ${PORT}');
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🛒 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🎬 Hero Video API: http://localhost:${PORT}/api/hero-video`);
  console.log(`📱 WhatsApp API: http://localhost:${PORT}/api/whatsapp`);
  console.log(`👥 Visitors API: http://localhost:${PORT}/api/visitors`);
  console.log(`📋 Catalog API: http://localhost:${PORT}/api/catalog`);
});

module.exports = app;