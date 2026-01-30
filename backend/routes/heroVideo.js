const express = require('express');
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/hero-video - Récupérer la vidéo hero
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_video')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      success: true,
      video_url: data?.video_url || null
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/hero-video - Mettre à jour la vidéo hero (admin seulement)
router.post('/', async (req, res) => {
  try {
    const { video_url } = req.body;

    // Vérifier s'il existe déjà une entrée
    const { data: existing } = await supabase
      .from('hero_video')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Mettre à jour l'entrée existante
      result = await supabase
        .from('hero_video')
        .update({ video_url })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Créer une nouvelle entrée
      result = await supabase
        .from('hero_video')
        .insert({ video_url })
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    res.json({
      success: true,
      message: 'Vidéo hero mise à jour avec succès',
      data: result.data
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// DELETE /api/hero-video - Supprimer la vidéo hero
router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from('hero_video')
      .delete()
      .not('id', 'is', null); // Supprimer toutes les entrées

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Vidéo hero supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

module.exports = router;