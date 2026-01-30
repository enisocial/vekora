import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ApiService from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ApiService.getProduct(id);
      setProduct(productData);
    } catch (err) {
      setError('Produit non trouvé');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} x ${product.name} ajouté(s) au panier !`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price).replace('XAF', 'FCFA');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Retour au catalogue
        </button>
      </div>
    );
  }

  // Créer la liste des images (image principale + images supplémentaires)
  const allImages = [
    product.image_url,
    ...(product.product_images?.map(img => img.image_url) || [])
  ].filter(Boolean);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          <i className="fas fa-arrow-left"></i>
          Retour au catalogue
        </button>

        <div className="product-detail">
          {/* Galerie d'images */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={allImages[selectedImage] || '/placeholder.jpg'} 
                alt={product.name}
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="image-thumbnails">
                {allImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            {product.categories && (
              <div className="product-category">
                <i className="fas fa-tag"></i>
                {product.categories.name}
              </div>
            )}

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Aucune description disponible'}</p>
            </div>

            {/* Vidéo si disponible */}
            {product.video_url && (
              <div className="product-video">
                <h3>Vidéo du produit</h3>
                <video controls>
                  <source src={product.video_url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            )}

            {/* Ajout au panier */}
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label>Quantité :</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary add-to-cart-btn">
                <i className="fas fa-shopping-cart"></i>
                Ajouter au panier - {formatPrice(product.price * quantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;