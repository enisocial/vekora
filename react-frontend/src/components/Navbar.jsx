import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Vekora
        </Link>
        <div className="nav-slogan">
          Le marché du futur
        </div>
        
        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          <Link to="/" className="nav-link">Catalogue</Link>
          <Link to="/cart" className="nav-link cart-link">
            <i className="fas fa-shopping-cart"></i>
            Panier
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link 
              to="/" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-home"></i>
              <span>Accueil</span>
            </Link>
            <Link 
              to="/cart" 
              className="mobile-nav-link cart-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Panier</span>
              {itemCount > 0 && <span className="mobile-cart-count">{itemCount}</span>}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;