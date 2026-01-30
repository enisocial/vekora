const API_BASE_URL = '/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Produits
  static async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  static async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  static async createProduct(productData, token) {
    return this.request('/products', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(productData)
    });
  }

  static async updateProduct(id, productData, token) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(productData)
    });
  }

  static async deleteProduct(id, token) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Catégories
  static async getCategories() {
    return this.request('/categories');
  }

  static async createCategory(categoryData, token) {
    console.log('API - Creating category with data:', categoryData);
    return this.request('/categories', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(categoryData)
    });
  }

  static async updateCategory(id, categoryData, token) {
    console.log('API - Updating category with data:', categoryData);
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(categoryData)
    });
  }

  static async deleteCategory(id, token) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Commandes
  static async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  static async getOrders(params = {}, token) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async updateOrderStatus(id, status, token) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
  }

  // Hero Video
  static async getHeroVideo() {
    return this.request('/hero-video');
  }

  static async setHeroVideo(videoData, token) {
    return this.request('/hero-video', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(videoData)
    });
  }

  static async deleteHeroVideo(token) {
    return this.request('/hero-video', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // WhatsApp
  static async getWhatsAppConfig() {
    return this.request('/whatsapp');
  }

  static async setWhatsAppConfig(configData, token) {
    return this.request('/whatsapp', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(configData)
    });
  }
}

export default ApiService;