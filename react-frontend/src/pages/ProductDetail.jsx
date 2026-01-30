import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price).replace('XAF', 'FCFA');
  };

  const formatDescription = (description) => {
    if (!description) return '';
    
    // Diviser par paragraphes et traiter chaque ligne
    return description
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
          return <br key={index} />;
        }
        return (
          <p key={index}>
            {trimmedLine}
          </p>
        );
      });
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
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
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const images = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Retour
        </button>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              {product.video_url ? (
                <video controls className="product-video">
                  <source src={product.video_url} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={images[selectedImage] || '/placeholder.jpg'} 
                  alt={product.name}
                  className="main-product-image"
                />
              )}
            </div>
            
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            {product.categories && (
              <div className="product-category">
                <i className="fas fa-tag"></i>
                {product.categories.name}
              </div>
            )}

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <div className="description-content">
                  {formatDescription(product.description)}
                </div>
              </div>
            )}

            <div className="product-actions">
              <button onClick={addToCart} className="btn btn-primary btn-large">
                <i className="fas fa-shopping-cart"></i>
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;