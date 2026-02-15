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
      <div className="cart-page">
        <div className="cart-container">
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
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <i className="fas fa-shopping-cart"></i>
            <h2>Votre panier est vide</h2>
            <p>Découvrez nos meubles et ajoutez-les à votre panier</p>
            <a href="/" className="btn btn-primary">
              Voir les produits
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Votre Panier</h1>
          <p>{items.length} article{items.length > 1 ? 's' : ''} dans votre panier</p>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image_url || '/placeholder.jpg'} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-category">{item.category_name || 'Meuble'}</div>
                  <h3 className="cart-item-title">{item.name}</h3>
                  <div className="cart-item-price">
                    {item.promotional_price && item.promotional_price < item.price ? (
                      <>
                        <span className="price-original">{formatPrice(item.price)}</span>
                        <span className="price-current">{formatPrice(item.promotional_price)}</span>
                      </>
                    ) : (
                      <span className="price-current">{formatPrice(item.price)}</span>
                    )}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    <div className="subtotal-label">Total</div>
                    <div className="subtotal-value">
                      {item.promotional_price && item.promotional_price < item.price ? 
                        formatPrice(item.promotional_price * item.quantity) : 
                        formatPrice(item.price * item.quantity)
                      }
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="cart-item-remove"
                    title="Supprimer"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Résumé</h2>
            <div className="cart-summary-row">
              <span>Sous-total</span>
              <span className="amount">{formatPrice(getTotal())}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span className="amount">{formatPrice(getTotal())}</span>
            </div>

            <form onSubmit={handleSubmitOrder} className="order-form">
              <h3><i className="fas fa-truck"></i> Informations de livraison</h3>
              
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

              <div className="cart-summary-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Commande en cours...' : 'Passer commande'}
                </button>
                <button 
                  type="button" 
                  onClick={clearCart}
                  className="btn btn-secondary"
                >
                  Vider le panier
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