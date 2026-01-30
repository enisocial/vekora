import { useState } from 'react';
import { useCart } from '../context/CartContext';
import ApiService from '../api/api';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_location: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price).replace('XAF', 'FCFA');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        delivery_location: orderForm.delivery_location,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        total_amount: getTotal()
      };

      await ApiService.createOrder(orderData);
      
      setOrderSuccess(true);
      clearCart();
      setOrderForm({
        customer_name: '',
        customer_phone: '',
        delivery_location: ''
      });
      
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la création de la commande: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container">
        <div className="order-success">
          <i className="fas fa-check-circle"></i>
          <h2>Commande confirmée !</h2>
          <p>Votre commande a été créée avec succès.</p>
          <p>Nous vous contacterons bientôt pour la livraison.</p>
          <button 
            onClick={() => setOrderSuccess(false)} 
            className="btn btn-primary"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <a href="/" className="btn btn-primary">
            Voir les produits
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <h1>Votre Panier</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image_url || '/placeholder.jpg'} alt={item.name} />
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-form">
            <div className="cart-summary">
              <h3>Total: {formatPrice(getTotal())}</h3>
            </div>

            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <h3>Informations de livraison</h3>
              
              <div className="form-group">
                <label htmlFor="customer_name">Nom complet *</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={orderForm.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer_phone">Téléphone *</label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  value={orderForm.customer_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery_location">Adresse de livraison *</label>
                <textarea
                  id="delivery_location"
                  name="delivery_location"
                  value={orderForm.delivery_location}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={clearCart}
                  className="btn btn-secondary"
                >
                  Vider le panier
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Commande en cours...' : 'Passer commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;