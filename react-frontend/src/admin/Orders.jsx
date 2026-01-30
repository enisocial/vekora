import { useState, useEffect } from 'react';
import ApiService from '../api/api';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      console.log('Loading orders with token:', token ? 'Present' : 'Missing');
      const ordersData = await ApiService.getOrders({}, token);
      console.log('Orders response:', ordersData);
      
      // Gérer différents formats de réponse
      const ordersList = ordersData.orders || ordersData.data || ordersData || [];
      setOrders(ordersList);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    if (confirm('Confirmer cette commande ?')) {
      try {
        console.log('Confirming order:', orderId);
        const response = await ApiService.updateOrderStatus(orderId, 'confirmed', token);
        console.log('Order confirmation response:', response);
        
        // Actualiser la liste des commandes
        await loadOrders();
        
        // Fermer le modal si ouvert
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
        
        alert('Commande confirmée avec succès !');
      } catch (error) {
        console.error('Error confirming order:', error);
        alert('Erreur lors de la confirmation: ' + error.message);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price).replace('XAF', 'FCFA');
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
        <p>Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Gestion des commandes</h1>
        <button 
          onClick={loadOrders} 
          className="btn btn-secondary"
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i>
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la commande #{selectedOrder.id.slice(0, 8)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="modal-close">&times;</button>
            </div>
            
            <div className="order-details">
              <div className="customer-info">
                <h4>Informations client</h4>
                <p><strong>Nom:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Téléphone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Adresse:</strong> {selectedOrder.delivery_location}</p>
              </div>

              <div className="order-info">
                <h4>Informations commande</h4>
                <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                <p><strong>Statut:</strong> 
                  <span className={`status-badge ${selectedOrder.status}`}>
                    {selectedOrder.status === 'pending' ? 'En attente' : 'Confirmée'}
                  </span>
                </p>
                <p><strong>Total:</strong> {formatPrice(selectedOrder.total_amount)}</p>
              </div>

              {selectedOrder.order_items && (
                <div className="order-items">
                  <h4>Produits commandés</h4>
                  {selectedOrder.order_items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.products?.name || 'Produit'}</span>
                        <span className="item-qty">Quantité: {item.quantity}</span>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedOrder.status === 'pending' && (
                <div className="order-actions">
                  <button 
                    onClick={() => {
                      handleConfirmOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="btn btn-primary"
                  >
                    Confirmer la commande
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="orders-table">
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {order.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="customer-info">
                        <span className="customer-name">{order.customer_name}</span>
                        <span className="customer-phone">{order.customer_phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="products-showcase">
                      {order.order_items && order.order_items.length > 0 ? (
                        <>
                          {order.order_items.slice(0, 3).map((item, index) => (
                            <div key={index} className="product-item-simple">
                              <div className="product-info-simple">
                                <span className="product-name-simple">
                                  {item.products?.name || 'Produit'}
                                </span>
                                <span className="product-qty-simple">
                                  Qté: {item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="more-items-simple">
                              +{order.order_items.length - 3} autres
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="no-products">
                          <span>Aucun produit</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'pending' ? 'En attente' : 'Confirmée'}
                    </span>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-sm btn-primary"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleConfirmOrder(order.id)}
                          className="btn btn-sm btn-success"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>Aucune commande</h3>
            <p>Les commandes apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;