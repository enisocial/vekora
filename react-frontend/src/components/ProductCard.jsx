import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product);
    
    // Animation de feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const formatPrice = (price, promotionalPrice) => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    });
    
    if (promotionalPrice && promotionalPrice < price) {
      return (
        <div className="price-container">
          <span className="original-price">{formatter.format(price).replace('XAF', 'FCFA')}</span>
          <span className="promotional-price">{formatter.format(promotionalPrice).replace('XAF', 'FCFA')}</span>
        </div>
      );
    }
    
    return formatter.format(price).replace('XAF', 'FCFA');
  };

  return (
    <Link to={`/product/${product.id}`} className={`product-card ${product.is_featured ? 'featured' : ''}`}>
      <div className="product-image">
        <img 
          src={product.image_url || '/placeholder.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        {product.video_url && (
          <div className="video-indicator">
            <i className="fas fa-play"></i>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price, product.promotional_price)}</div>
          <button 
            className={`btn btn-primary add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <i className={`fas ${isAdding ? 'fa-check' : 'fa-cart-plus'}`}></i>
            {isAdding ? 'Ajouté!' : 'Ajouter'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;