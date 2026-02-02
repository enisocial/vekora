import { useState, useEffect } from 'react';
import ApiService from '../api/api';

const Dashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getOrders({}, token)
      ]);

      const products = productsData.data || productsData || [];
      const orders = ordersData.orders || ordersData.data || ordersData || [];
      
      const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'pending') : [];
      const confirmedOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'confirmed') : [];
      const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) : 0;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        pendingOrders: pendingOrders.length,
        confirmedOrders: confirmedOrders.length,
        totalRevenue,
        recentOrders: Array.isArray(orders) ? orders.slice(0, 5) : []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      });
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

  const resetCounters = async () => {
    try {
      setLoading(true);
      
      // Reset products
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/reset`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la remise à zéro des produits');
      }
      
      // Reset orders
      const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/reset`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!ordersResponse.ok) {
        throw new Error('Erreur lors de la remise à zéro des commandes');
      }
      
      // Reload stats
      await loadStats();
      alert('Compteurs remis à zéro avec succès');
    } catch (error) {
      console.error('Erreur lors de la remise à zéro:', error);
      alert('Erreur lors de la remise à zéro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="header-actions">
          <button onClick={loadStats} className="btn btn-primary" disabled={loading}>
            <i className="fas fa-sync-alt"></i>
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir remettre les compteurs à zéro ? Cette action supprimera tous les produits et commandes de façon irréversible.')) {
                resetCounters();
              }
            }}
            className="btn btn-danger"
            disabled={loading}
          >
            <i className="fas fa-trash-alt"></i>
            {loading ? 'Reset en cours...' : 'Reset compteurs'}
          </button>
          <button onClick={onLogout} className="btn btn-secondary">
            <i className="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h4 className="stat-card-title">Produits</h4>
            <div className="stat-card-icon products">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="stat-card-value">{stats.totalProducts}</div>
          <div className="stat-card-change positive">
            Total des produits
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h4 className="stat-card-title">Commandes</h4>
            <div className="stat-card-icon orders">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="stat-card-value">{stats.totalOrders}</div>
          <div className="stat-card-change positive">
            {stats.pendingOrders} en attente, {stats.confirmedOrders} confirmées
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h4 className="stat-card-title">Chiffre d'affaires</h4>
            <div className="stat-card-icon revenue">
              <i className="fas fa-coins"></i>
            </div>
          </div>
          <div className="stat-card-value">{formatPrice(stats.totalRevenue)}</div>
          <div className="stat-card-change positive">
            Total des ventes
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Commandes récentes</h2>
        {stats.recentOrders.length > 0 ? (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{order.customer_name}</td>
                    <td>{formatPrice(order.total_amount)}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === 'pending' ? 'En attente' : 'Confirmée'}
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Aucune commande récente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;