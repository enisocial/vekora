const express = require('express');
const router = express.Router();
const { exportProductsCSV } = require('../controllers/catalog');

// Export products as CSV for Facebook catalog
router.get('/facebook-csv', exportProductsCSV);

module.exports = router;