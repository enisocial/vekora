const getWhatsAppConfig = async (req, res) => {
  console.log('WhatsApp endpoint called');
  res.json({ phone_number: '', message_template: '', is_active: false });
};

const setWhatsAppConfig = async (req, res) => {
  res.json({ message: 'Config saved' });
};

module.exports = {
  getWhatsAppConfig,
  setWhatsAppConfig
};