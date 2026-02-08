const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  resetOrders
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

// Get all orders (public for now)
router.get('/',
  getOrders
);

// Get single order (public for now)
router.get('/:id',
  getOrder
);

// Update order status (public for now)
router.put('/:id/status',
  updateOrderStatus
);

// Reset all orders (public for now)
router.delete('/reset',
  resetOrders
);

module.exports = router;