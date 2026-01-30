import { useState, useEffect } from 'react';
import ApiService from '../api/api';
import { supabase } from '../api/supabase';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    video_url: '',
    additional_images: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories()
      ]);
      
      console.log('Products response:', productsData);
      console.log('Categories response:', categoriesData);
      
      setProducts(productsData.data || productsData || []);
      setCategories(categoriesData.data || categoriesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, type = 'image') => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('products-media')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('products-media')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadFile(file, type);
    if (url) {
      if (type === 'additional') {
        setFormData({
          ...formData,
          additional_images: [...formData.additional_images, url]
        });
      } else {
        setFormData({
          ...formData,
          [`${type}_url`]: url
        });
      }
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = formData.additional_images.filter((_, i) => i !== index);
    setFormData({ ...formData, additional_images: newImages });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('=== FRONTEND SUBMIT DEBUG ===');
      console.log('Form data state:', formData);
      
      // Validation côté client
      if (!formData.name || !formData.name.trim()) {
        alert('Le nom du produit est requis');
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        alert('Le prix doit être supérieur à 0');
        return;
      }
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : '',
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        additional_images: formData.additional_images || []
      };
      
      console.log('Sending product data:', JSON.stringify(productData, null, 2));

      if (editingProduct) {
        await ApiService.updateProduct(editingProduct.id, productData, token);
      } else {
        await ApiService.createProduct(productData, token);
      }

      await loadData();
      resetForm();
      alert(editingProduct ? 'Produit mis à jour !' : 'Produit créé !');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const additionalImages = product.product_images ? product.product_images.map(img => img.image_url) : [];
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      video_url: product.video_url || '',
      additional_images: additionalImages
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        console.log('Deleting product:', productId);
        await ApiService.deleteProduct(productId, token);
        console.log('Product deleted successfully');
        await loadData();
        alert('Produit supprimé !');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Erreur: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      video_url: '',
      additional_images: []
    });
    setEditingProduct(null);
    setShowForm(false);
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
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Gestion des produits</h1>
        <div className="header-actions">
          <button 
            onClick={loadData} 
            className="btn btn-secondary"
            title="Recharger les données"
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i>
            {loading ? 'Chargement...' : 'Recharger'}
          </button>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Nouveau produit
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={resetForm} className="modal-close">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom du produit *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Prix *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category_id">Catégorie</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Sans catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Image du produit</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                    disabled={uploading}
                  />
                  {formData.image_url && (
                    <div className="file-preview">
                      <img src={formData.image_url} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Vidéo du produit</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'video')}
                    disabled={uploading}
                  />
                  {formData.video_url && (
                    <div className="file-preview">
                      <video src={formData.video_url} controls style={{width: '200px', height: '120px'}} />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Images supplémentaires</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'additional')}
                    disabled={uploading}
                  />
                  <div className="additional-images-grid">
                    {formData.additional_images.map((url, index) => (
                      <div key={index} className="additional-image-item">
                        <img src={url} alt={`Image ${index + 1}`} style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                        <button 
                          type="button" 
                          onClick={() => removeAdditionalImage(index)}
                          className="remove-image-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Upload en cours...' : (editingProduct ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <img 
                          src={product.image_url || '/placeholder.jpg'} 
                          alt={product.name}
                          className="product-thumb"
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{category ? category.name : 'Sans catégorie'}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="btn btn-sm btn-primary"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <i className="fas fa-box-open"></i>
            <h3>Aucun produit</h3>
            <p>Commencez par ajouter votre premier produit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;