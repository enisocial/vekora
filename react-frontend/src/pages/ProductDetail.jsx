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
  const [whatsappConfig, setWhatsappConfig] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
    loadWhatsAppConfig();
  }, [id]);

  // SEO: Mettre à jour les meta tags quand le produit est chargé
  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Vekora | Meuble sur Mesure`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `${product.name} - ${product.description?.substring(0, 150) || 'Meuble artisanal sur mesure'} | Précommande chez Vekora`);
      }
      
      // Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      
      if (ogTitle) ogTitle.setAttribute('content', `${product.name} - Vekora`);
      if (ogDescription) ogDescription.setAttribute('content', product.description?.substring(0, 150) || 'Meuble artisanal sur mesure');
      if (ogImage && product.image_url) ogImage.setAttribute('content', product.image_url);
    }
  }, [product]);

  // Auto-défilement des images
  useEffect(() => {
    if (product && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 4000); // Change d'image toutes les 4 secondes
      
      return () => clearInterval(interval);
    }
  }, [product]);

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

  const loadWhatsAppConfig = async () => {
    try {
      const response = await ApiService.getWhatsAppConfig();
      setWhatsappConfig(response.config);
    } catch (err) {
      console.error('Erreur WhatsApp config:', err);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!whatsappConfig?.phone_number) {
      alert('Service WhatsApp non disponible');
      return;
    }

    const message = `Bonjour, je souhaite faire une précommande pour ce meuble :\n\n` +
                   `🪑 ${product.name}\n` +
                   `💰 Prix: ${formatPrice(product.price)}\n\n` +
                   `Je souhaite prendre rendez-vous pour verser l'acompte et finaliser ma précommande.\n\n` +
                   `Merci de me contacter pour organiser cela.`;
    
    const whatsappUrl = `https://wa.me/${whatsappConfig.phone_number.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  const handleAddToCart = () => {
    addToCart(product);
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
                <div className="image-slider">
                  <img 
                    src={images[currentImageIndex] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="main-product-image"
                    key={currentImageIndex}
                  />
                  {images.length > 1 && (
                    <>
                      <button 
                        className="slider-btn prev-btn"
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button 
                        className="slider-btn next-btn"
                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      <div className="slider-dots">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
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

            <div className="product-features">
              <div className="feature-item">
                <i className="fas fa-hammer"></i>
                <span>Fabrication artisanale</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Garantie produit</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-phone"></i>
                <span>Support client</span>
              </div>
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <div className="description-content">
                  {formatDescription(product.description)}
                </div>
              </div>
            )}

            <div className="delivery-info">
              <h4><i className="fas fa-truck"></i> Informations de livraison</h4>
              <p>• Livraison sous 7 à 14 jours après validation de l'acompte</p>
              <p>• Frais de livraison calculés selon votre localisation</p>
              <p>• Possibilité de retrait à l'atelier</p>
            </div>

            <div className="product-actions">
              <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                <i className="fas fa-calendar-plus"></i>
                Faire une précommande
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="btn btn-secondary btn-large" 
                style={{marginTop: '10px'}}
              >
                <i className="fab fa-whatsapp"></i>
                Précommander par WhatsApp
              </button>
            </div>

            <div className="preorder-info-box">
              <h4><i className="fas fa-info-circle"></i> Produit en précommande</h4>
              <div className="preorder-details">
                <p><i className="fas fa-hammer"></i> <strong>Fabrication après validation</strong></p>
                <p><i className="fas fa-clock"></i> <strong>Livraison estimée :</strong> 7 à 14 jours</p>
                <p><i className="fas fa-handshake"></i> <strong>Acompte à verser</strong> à l'atelier ou lors d'un rendez-vous</p>
                <p><i className="fas fa-truck"></i> <strong>Livraison</strong> après validation de l'acompte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp flottant */}
      {whatsappConfig?.phone_number && (
        <a
          href={`https://wa.me/${whatsappConfig.phone_number.replace('+', '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par ce produit: ${product?.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          title="Commander sur WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )}
    </div>
  );
};

export default ProductDetail;