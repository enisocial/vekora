const { supabase, supabaseAdmin } = require('../config/supabase');

const getWhatsAppConfig = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('whatsapp_config')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('WhatsApp config error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Si pas de config, retourner des valeurs par défaut
    const config = data || {
      phone: '',
      message: 'Bonjour, je suis intéressé par vos produits',
      is_active: false
    };

    res.json(config);
  } catch (error) {
    console.error('WhatsApp config error:', error);
    res.status(500).json({ error: 'Failed to get WhatsApp config' });
  }
};

const setWhatsAppConfig = async (req, res) => {
  try {
    const { phone, message, is_active } = req.body;

    const configData = {
      phone: phone || '',
      message: message || 'Bonjour, je suis intéressé par vos produits',
      is_active: is_active || false
    };

    // Essayer de mettre à jour d'abord
    const { data: existingData } = await supabase
      .from('whatsapp_config')
      .select('id')
      .single();

    let result;
    if (existingData) {
      // Mettre à jour
      result = await supabaseAdmin
        .from('whatsapp_config')
        .update(configData)
        .eq('id', existingData.id)
        .select()
        .single();
    } else {
      // Créer
      result = await supabaseAdmin
        .from('whatsapp_config')
        .insert(configData)
        .select()
        .single();
    }

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    res.json({ success: true, data: result.data });
  } catch (error) {
    console.error('WhatsApp config save error:', error);
    res.status(500).json({ error: 'Failed to save WhatsApp config' });
  }
};

module.exports = {
  getWhatsAppConfig,
  setWhatsAppConfig
};