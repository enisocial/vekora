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
  createCategory
);

// Update category (admin only)
router.put('/:id',
  updateCategory
);

// Delete category (admin only)
router.delete('/:id',
  deleteCategory
);

module.exports = router;