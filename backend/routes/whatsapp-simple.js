const { getWhatsAppConfig, setWhatsAppConfig } = require('../controllers/whatsapp');
const express = require('express');
const router = express.Router();

router.get('/', getWhatsAppConfig);
router.post('/', setWhatsAppConfig);

module.exports = router;