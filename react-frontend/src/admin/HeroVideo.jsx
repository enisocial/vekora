import { useState, useEffect } from 'react';
import ApiService from '../api/api';
import { supabase } from '../api/supabase';
import './hero-video.css';

const HeroVideo = ({ token }) => {
  const [heroVideo, setHeroVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    video_url: ''
  });

  useEffect(() => {
    loadHeroVideo();
  }, []);

  const loadHeroVideo = async () => {
    try {
      const data = await ApiService.getHeroVideo();
      if (data.success && data.video_url) {
        setHeroVideo({ video_url: data.video_url });
      } else {
        setHeroVideo(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setHeroVideo(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_video_${Date.now()}.${fileExt}`;
      
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

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadVideo(file);
    if (url) {
      setFormData({ ...formData, video_url: url });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await ApiService.setHeroVideo({ video_url: formData.video_url }, token);
      
      await loadHeroVideo();
      setFormData({ title: '', video_url: '' });
      alert('Vidéo mise à jour !');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (confirm('Supprimer la vidéo de la page d\'accueil ?')) {
      try {
        await ApiService.deleteHeroVideo(token);
        await loadHeroVideo();
        alert('Vidéo supprimée !');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Erreur: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="hero-video-admin">
      <div className="page-header">
        <h1>Vidéo de la page d'accueil</h1>
      </div>

      {heroVideo && (
        <div className="current-video">
          <h3>Vidéo actuelle</h3>
          <div className="video-preview">
            <video 
              src={heroVideo.video_url} 
              controls 
              style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
            />
            <button onClick={handleDelete} className="btn btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      )}

      <div className="video-form">
        <h3>{heroVideo ? 'Remplacer la vidéo' : 'Ajouter une vidéo'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fichier vidéo</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              disabled={uploading}
            />
            <small>Ou saisissez une URL :</small>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
            />
          </div>

          {formData.video_url && (
            <div className="video-preview">
              <video 
                src={formData.video_url} 
                controls 
                style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Upload en cours...' : (heroVideo ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroVideo;