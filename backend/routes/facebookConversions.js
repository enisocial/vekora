const express = require('express');
const router = express.Router();
const {
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackPurchase
} = require('../controllers/facebookConversions');

// Track events
router.post('/pageview', trackPageView);
router.post('/viewcontent', trackViewContent);
router.post('/addtocart', trackAddToCart);
router.post('/purchase', trackPurchase);

module.exports = router;