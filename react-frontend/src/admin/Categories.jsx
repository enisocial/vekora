import { useState, useEffect } from 'react';
import ApiService from '../api/api';
import { supabase } from '../api/supabase';

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await ApiService.getCategories();
      console.log('Loaded categories:', categoriesData);
      setCategories(categoriesData.data || categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `category_${Date.now()}.${fileExt}`;
      
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, image_url: url });
    }
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
      const categoryData = {
        name: formData.name,
        description: formData.description
      };
      
      if (formData.image_url) {
        categoryData.image_url = formData.image_url;
      }

      console.log('Submitting category data:', categoryData);

      if (editingCategory) {
        await ApiService.updateCategory(editingCategory.id, categoryData, token);
      } else {
        await ApiService.createCategory(categoryData, token);
      }

      await loadCategories();
      resetForm();
      alert(editingCategory ? 'Catégorie mise à jour !' : 'Catégorie créée !');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await ApiService.deleteCategory(categoryId, token);
        await loadCategories();
        alert('Catégorie supprimée !');
      } catch (error) {
        alert('Erreur: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="page-header">
        <h1>Gestion des catégories</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
              <button onClick={resetForm} className="modal-close">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Nom de la catégorie *</label>
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
                <label>Image de la catégorie</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                <small>Ou saisissez une URL d'image :</small>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="file-preview">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      style={{width: '150px', height: '100px', objectFit: 'cover'}} 
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Upload en cours...' : (editingCategory ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img 
                  src={category.image_url || '/placeholder.jpg'} 
                  alt={category.name}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-actions">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="btn btn-sm btn-primary"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-tags"></i>
            <h3>Aucune catégorie</h3>
            <p>Commencez par ajouter votre première catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;