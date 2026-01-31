const { supabase, supabaseAdmin } = require('../config/supabase');

const getHeroVideo = async (req, res) => {
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
};

const updateHeroVideo = async (req, res) => {
  try {
    const { video_url } = req.body;
    console.log('Updating hero video with URL:', video_url);

    // Vérifier s'il existe déjà une entrée
    const { data: existing } = await supabaseAdmin
      .from('hero_video')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Mettre à jour l'entrée existante
      result = await supabaseAdmin
        .from('hero_video')
        .update({ video_url })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Créer une nouvelle entrée
      result = await supabaseAdmin
        .from('hero_video')
        .insert({ video_url })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error:', result.error);
      throw result.error;
    }

    console.log('Hero video updated successfully:', result.data);
    res.json({
      success: true,
      message: 'Vidéo hero mise à jour avec succès',
      data: result.data
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour: ' + error.message
    });
  }
};

module.exports = {
  getHeroVideo,
  updateHeroVideo
};