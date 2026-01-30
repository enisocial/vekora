import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import WhatsAppFloat from './components/WhatsAppFloat';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Categories from './admin/Categories';
import HeroVideo from './admin/HeroVideo';
import WhatsApp from './admin/WhatsApp';
import Orders from './admin/Orders';
import './new-design.css';

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard');

  const handleAdminLogin = (user, token) => {
    setAdminUser(user);
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    setCurrentAdminPage('dashboard');
  };

  // Interface d'administration
  if (window.location.pathname.startsWith('/admin')) {
    if (!adminUser) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    return (
      <div className="admin-app">
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h2>Vekora Admin</h2>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={currentAdminPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('dashboard')}
            >
              <i className="fas fa-chart-line"></i>
              <span>Tableau de bord</span>
            </button>
            <button 
              className={currentAdminPage === 'categories' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('categories')}
            >
              <i className="fas fa-tags"></i>
              <span>Catégories</span>
            </button>
            <button 
              className={currentAdminPage === 'products' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('products')}
            >
              <i className="fas fa-box"></i>
              <span>Produits</span>
            </button>
            <button 
              className={currentAdminPage === 'orders' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('orders')}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Commandes</span>
            </button>
            <button 
              className={currentAdminPage === 'hero-video' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('hero-video')}
            >
              <i className="fas fa-video"></i>
              <span>Vidéo d'accueil</span>
            </button>
            <button 
              className={currentAdminPage === 'whatsapp' ? 'active' : ''}
              onClick={() => setCurrentAdminPage('whatsapp')}
            >
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </button>
            <button 
              className="admin-btn admin-btn-danger"
              onClick={handleAdminLogout}
              style={{ marginTop: 'auto', margin: '2rem 0.75rem 1rem' }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Déconnexion</span>
            </button>
          </nav>
        </div>
        
        <div className="admin-main">
          {currentAdminPage === 'dashboard' && (
            <Dashboard token={adminToken} onLogout={handleAdminLogout} />
          )}
          {currentAdminPage === 'categories' && (
            <Categories token={adminToken} />
          )}
          {currentAdminPage === 'products' && (
            <Products token={adminToken} />
          )}
          {currentAdminPage === 'orders' && (
            <Orders token={adminToken} />
          )}
          {currentAdminPage === 'hero-video' && (
            <HeroVideo token={adminToken} />
          )}
          {currentAdminPage === 'whatsapp' && (
            <WhatsApp token={adminToken} />
          )}
        </div>
      </div>
    );
  }

  // Interface client
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <WhatsAppFloat />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;