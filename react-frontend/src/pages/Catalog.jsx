import { useState, useEffect, useRef } from 'react';
import ApiService from '../api/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroVideo, setHeroVideo] = useState(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [whatsappConfig, setWhatsappConfig] = useState(null);
  const videoRef = useRef(null);

  const toggleVideoSound = async () => {
    console.log('toggleVideoSound appelé');
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('Video muted avant:', video.muted);
      
      try {
        if (video.muted) {
          video.muted = false;
          await video.play();
        } else {
          video.muted = true;
        }
        setVideoMuted(video.muted);
        console.log('Video muted après:', video.muted);
      } catch (error) {
        console.log('Erreur:', error);
      }
    } else {
      console.log('videoRef.current est null');
    }
  };

  useEffect(() => {
    loadData();
    loadHeroVideo();
    loadWhatsAppConfig();
  }, []);

  // Effet pour gérer le replay automatique toutes les 30 secondes
  useEffect(() => {
    if (heroVideo && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }, 30000); // 30 secondes

      return () => clearInterval(interval);
    }
  }, [heroVideo]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories()
      ]);
      
      setProducts(productsData.data || productsData || []);
      setCategories(categoriesData.data || categoriesData || []);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHeroVideo = async () => {
    try {
      const data = await ApiService.getHeroVideo();
      if (data.success && data.video_url) {
        setHeroVideo(data.video_url);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la vidéo hero:', err);
    }
  };

  const loadWhatsAppConfig = async () => {
    try {
      const config = await ApiService.getWhatsAppConfig();
      setWhatsappConfig(config);
    } catch (err) {
      console.error('Erreur lors du chargement de la config WhatsApp:', err);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={loadData} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="hero-section">
        {heroVideo && (
          <div className="hero-video">
            <video 
              ref={videoRef}
              autoPlay 
              muted={videoMuted}
              playsInline
              className="hero-video-element"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
        )}
        {heroVideo && (
          <button 
            className="video-sound-toggle"
            onClick={toggleVideoSound}
            title={videoMuted ? 'Activer le son' : 'Couper le son'}
            style={{ 
              position: 'fixed',
              top: '100px',
              right: '20px',
              zIndex: 99999,
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              cursor: 'pointer'
            }}
          >
            <i className={`fas ${videoMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
          </button>
        )}
        <div className="hero-content">
          <h1>Vekora - Marketplace Multi-Produits</h1>
          <p>Nous permettons aux clients d'acheter tout ce dont ils ont besoin, facilement, rapidement, et en toute sécurité</p>
        </div>
      </div>

      <div className="container">
        {/* Section Catégories */}
        {categories.length > 0 && (
          <div className="categories-section">
            <h2>Nos Catégories</h2>
            <div className="categories-grid-client">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onSelect={handleCategorySelect}
                  isSelected={selectedCategory === category.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section Produits */}
        <div className="catalog-header">
          <h2>
            {selectedCategory 
              ? `Produits - ${categories.find(c => c.id === selectedCategory)?.name || 'Catégorie'}`
              : 'Tous nos Produits'
            }
          </h2>
          
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory('')}
              className="btn btn-secondary"
            >
              <i className="fas fa-times"></i>
              Voir tous les produits
            </button>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>Aucun produit trouvé</h3>
              <p>
                {selectedCategory 
                  ? 'Aucun produit dans cette catégorie'
                  : 'Aucun produit disponible'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bouton WhatsApp flottant */}
      {whatsappConfig && whatsappConfig.phone && (
        <a
          href={`https://wa.me/${whatsappConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappConfig.message || 'Bonjour, je suis intéressé par vos produits')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          title="Contactez-nous sur WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )}
    </div>
  );
};

export default Catalog;