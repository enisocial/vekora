const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');
const { requireAdmin, verifyAdminRole } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get WhatsApp config (public)
router.get('/', async (req, res) => {
  try {
    const { data: config, error } = await supabaseAdmin
      .from('whatsapp_config')
      .select('phone_number, message_template, is_active')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('WhatsApp config error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ 
      success: true, 
      config: config || null 
    });
  } catch (error) {
    console.error('Get WhatsApp config error:', error);
    res.status(500).json({ error: 'Failed to get WhatsApp config' });
  }
});

// Set WhatsApp config (admin only)
router.post('/',
  requireAdmin,
  verifyAdminRole,
  [
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('message_template').optional().isLength({ min: 1, max: 500 }),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { phone_number, message_template } = req.body;

      console.log('Setting WhatsApp config:', { phone_number, message_template });

      // Désactiver l'ancienne config
      await supabaseAdmin
        .from('whatsapp_config')
        .update({ is_active: false })
        .eq('is_active', true);

      // Créer nouvelle config
      const { data: config, error } = await supabaseAdmin
        .from('whatsapp_config')
        .insert({
          phone_number,
          message_template: message_template || 'Bonjour, je suis intéressé par vos produits sur Vekora.',
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('WhatsApp insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('WhatsApp config created:', config);

      res.json({ 
        success: true, 
        message: 'WhatsApp config updated successfully',
        config 
      });
    } catch (error) {
      console.error('Set WhatsApp config error:', error);
      res.status(500).json({ error: 'Failed to update WhatsApp config' });
    }
  }
);

module.exports = router;