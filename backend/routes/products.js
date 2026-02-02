const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts
} = require('../controllers/products');
const { requireAdmin, verifyAdminRole } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all products (public)
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isUUID(),
    handleValidationErrors
  ],
  getProducts
);

// Get single product (public)
router.get('/:id',
  [
    param('id').isUUID(),
    handleValidationErrors
  ],
  getProduct
);

// Route de test pour créer un produit sans validation
router.post('/create-test', async (req, res) => {
  try {
    console.log('=== TEST CREATE ROUTE ===');
    console.log('Body received:', req.body);
    
    const { supabaseAdmin } = require('../config/supabase');
    
    const productData = {
      name: req.body.name || 'Test Product',
      description: req.body.description || 'Test Description',
      price: parseFloat(req.body.price) || 99.99,
      category_id: req.body.category_id || null,
      image_url: req.body.image_url || null,
      video_url: req.body.video_url || null
    };
    
    console.log('Inserting:', productData);
    
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select('*')
      .single();

    if (error) {
      console.log('Error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Success:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Test create error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test route (temporary)
router.post('/test', (req, res) => {
  console.log('TEST ROUTE - Body:', JSON.stringify(req.body, null, 2));
  res.json({ message: 'Test successful', body: req.body });
});

// Create product (admin only)
router.post('/',
  requireAdmin,
  verifyAdminRole,
  createProduct
);

// Update product (admin only)
router.put('/:id',
  requireAdmin,
  verifyAdminRole,
  updateProduct
);

// Delete product (admin only)
router.delete('/:id',
  requireAdmin,
  verifyAdminRole,
  [
    param('id').isUUID(),
    handleValidationErrors
  ],
  deleteProduct
);

// Reset all products (admin only)
router.delete('/reset',
  requireAdmin,
  verifyAdminRole,
  resetProducts
);

module.exports = router;