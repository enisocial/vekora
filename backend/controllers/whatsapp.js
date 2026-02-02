const { supabaseAdmin } = require('../config/supabase');

const getWhatsAppConfig = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('whatsapp_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('WhatsApp get error:', error);
      return res.status(500).json({ error: error.message });
    }

    const config = {
      phone_number: data?.phone || '',
      message_template: data?.message || 'Bonjour, je suis intéressé par vos produits',
      is_active: data?.is_active || false
    };

    res.json({ config });
  } catch (error) {
    console.error('WhatsApp config error:', error);
    res.status(500).json({ error: 'Failed to get WhatsApp config' });
  }
};

const setWhatsAppConfig = async (req, res) => {
  try {
    const { phone_number, message_template } = req.body;

    // Supprimer toutes les configs existantes et en créer une nouvelle
    await supabaseAdmin.from('whatsapp_config').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data, error } = await supabaseAdmin
      .from('whatsapp_config')
      .insert({
        phone: phone_number || '',
        message: message_template || 'Bonjour, je suis intéressé par vos produits',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('WhatsApp save error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('WhatsApp save error:', error);
    res.status(500).json({ error: 'Failed to save WhatsApp config' });
  }
};

module.exports = {
  getWhatsAppConfig,
  setWhatsAppConfig
};