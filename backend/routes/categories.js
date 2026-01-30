const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');
const { requireAdmin, verifyAdminRole } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all categories (public)
router.get('/', getCategories);

// Get single category (public)
router.get('/:id',
  [
    param('id').isUUID(),
    handleValidationErrors
  ],
  getCategory
);

// Create category (admin only)
router.post('/',
  requireAdmin,
  verifyAdminRole,
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    handleValidationErrors
  ],
  createCategory
);

// Update category (admin only)
router.put('/:id',
  requireAdmin,
  verifyAdminRole,
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    handleValidationErrors
  ],
  updateCategory
);

// Delete category (admin only)
router.delete('/:id',
  requireAdmin,
  verifyAdminRole,
  [
    param('id').isUUID(),
    handleValidationErrors
  ],
  deleteCategory
);

module.exports = router;