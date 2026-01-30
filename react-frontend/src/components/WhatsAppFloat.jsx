import { useState, useEffect } from 'react';
import ApiService from '../api/api';

const WhatsAppFloat = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await ApiService.getWhatsAppConfig();
      if (response.config && response.config.phone_number) {
        setConfig(response.config);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la config WhatsApp:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (config) {
      const phoneNumber = config.phone_number.replace('+', '');
      const message = encodeURIComponent(config.message_template);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!config) {
    return null;
  }

  return (
    <div className="whatsapp-float" onClick={handleWhatsAppClick}>
      <i className="fab fa-whatsapp"></i>
    </div>
  );
};

export default WhatsAppFloat;