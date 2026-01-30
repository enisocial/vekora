const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orders');
const { requireAdmin, verifyAdminRole } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create order (public)
router.post('/',
  [
    body('customer_name').trim().isLength({ min: 1, max: 100 }),
    body('customer_phone').isMobilePhone(),
    body('delivery_location').trim().isLength({ min: 1, max: 500 }),
    body('items').isArray({ min: 1 }),
    body('items.*.product_id').isUUID(),
    body('items.*.quantity').isInt({ min: 1 }),
    handleValidationErrors
  ],
  createOrder
);

// Get all orders (admin only)
router.get('/',
  requireAdmin,
  verifyAdminRole,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['pending', 'confirmed']),
    handleValidationErrors
  ],
  getOrders
);

// Get single order (admin only)
router.get('/:id',
  requireAdmin,
  verifyAdminRole,
  [
    param('id').isUUID(),
    handleValidationErrors
  ],
  getOrder
);

// Update order status (admin only)
router.put('/:id/status',
  requireAdmin,
  verifyAdminRole,
  [
    param('id').isUUID(),
    body('status').isIn(['pending', 'confirmed']),
    handleValidationErrors
  ],
  updateOrderStatus
);

module.exports = router;