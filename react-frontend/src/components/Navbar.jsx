import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Vekora
        </Link>
        <div className="nav-slogan">
          Le marché du futur
        </div>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Catalogue</Link>
          <Link to="/cart" className="nav-link cart-link">
            <i className="fas fa-shopping-cart"></i>
            Panier
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;