import { useState, useEffect } from 'react';
import ApiService from '../api/api';

const WhatsApp = ({ token }) => {
  const [config, setConfig] = useState({
    phone_number: '',
    message_template: 'Bonjour, je suis intéressé par vos produits sur Vekora.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await ApiService.getWhatsAppConfig();
      if (response.config) {
        setConfig(response.config);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la config WhatsApp:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await ApiService.setWhatsAppConfig(config, token);
      alert('Configuration WhatsApp mise à jour avec succès !');
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de la configuration WhatsApp...</p>
      </div>
    );
  }

  return (
    <div className="admin-whatsapp">
      <div className="page-header">
        <h1>Configuration WhatsApp Business</h1>
      </div>

      <div className="admin-card">
        <h2>
          <i className="fab fa-whatsapp"></i>
          Paramètres WhatsApp
        </h2>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label htmlFor="phone_number">Numéro WhatsApp Business *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={config.phone_number}
              onChange={handleInputChange}
              placeholder="+237123456789"
              required
            />
            <small>Format international avec indicatif pays (ex: +237123456789)</small>
          </div>

          <div className="admin-form-group">
            <label htmlFor="message_template">Message par défaut</label>
            <textarea
              id="message_template"
              name="message_template"
              value={config.message_template}
              onChange={handleInputChange}
              rows="3"
              placeholder="Message qui sera pré-rempli quand les clients cliquent sur WhatsApp"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>

        {config.phone_number && (
          <div className="whatsapp-preview">
            <h3>Aperçu</h3>
            <p>Les clients verront une icône WhatsApp qui les redirigera vers :</p>
            <code>
              https://wa.me/{config.phone_number.replace('+', '')}?text={encodeURIComponent(config.message_template)}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsApp;