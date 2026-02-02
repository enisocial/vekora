const express = require('express');
const router = express.Router();
const { trackVisitor, getVisitorStats } = require('../controllers/visitors');

// Track visitor (public)
router.post('/track', trackVisitor);

// Get visitor stats (public for now)
router.get('/stats', getVisitorStats);

module.exports = router;