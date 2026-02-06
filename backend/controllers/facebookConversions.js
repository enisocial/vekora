const crypto = require('crypto');

const PIXEL_ID = '4391657164425200';
const ACCESS_TOKEN = 'EAAKtFPD8N9IBQlwWs3ZAONrHAE2eL6o4HZCwEa1kkRxZCG4Iqmx3xweScay97ZCKjSa00Im3eh8BflZASy4oAtU1dBRrxEdYeSg76FJTZAcAXYSKVBsfG0ZCxajNx34wplIlpezgWZAyjRkZBDucMZBOxz1VN1ZCHbijwHOXPilsIgnHHGBNNcEb4fNzQ8Vi6JiWraV0AZDZD';
const API_VERSION = 'v18.0';

// Hash data for privacy
const hashData = (data) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

// Send event to Facebook Conversions API
const sendFacebookEvent = async (eventName, eventData, userData) => {
  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    
    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventData.event_source_url || 'https://vekora.store',
        user_data: {
          client_ip_address: userData.ip,
          client_user_agent: userData.userAgent,
          em: userData.email ? hashData(userData.email) : null,
          ph: userData.phone ? hashData(userData.phone) : null
        },
        custom_data: eventData.custom_data || {}
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Facebook Conversion API response:', result);
    return result;
  } catch (error) {
    console.error('Facebook Conversion API error:', error);
    return null;
  }
};

// Track PageView
const trackPageView = async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    await sendFacebookEvent('PageView', {
      event_source_url: req.body.url || 'https://vekora.store'
    }, { ip, userAgent });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

// Track ViewContent
const trackViewContent = async (req, res) => {
  try {
    const { productId, productName, price, currency } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    await sendFacebookEvent('ViewContent', {
      event_source_url: `https://vekora.store/product/${productId}`,
      custom_data: {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: currency || 'XAF'
      }
    }, { ip, userAgent });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

// Track AddToCart
const trackAddToCart = async (req, res) => {
  try {
    const { productId, productName, price, quantity, currency } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    await sendFacebookEvent('AddToCart', {
      event_source_url: 'https://vekora.store',
      custom_data: {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price * quantity,
        currency: currency || 'XAF'
      }
    }, { ip, userAgent });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

// Track Purchase
const trackPurchase = async (req, res) => {
  try {
    const { orderId, total, items, customerEmail, customerPhone, currency } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    await sendFacebookEvent('Purchase', {
      event_source_url: 'https://vekora.store/cart',
      custom_data: {
        content_ids: items.map(item => item.product_id),
        content_type: 'product',
        value: total,
        currency: currency || 'XAF',
        num_items: items.length
      }
    }, { 
      ip, 
      userAgent,
      email: customerEmail,
      phone: customerPhone
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

module.exports = {
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackPurchase
};