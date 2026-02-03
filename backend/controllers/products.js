const { supabase, supabaseAdmin } = require('../config/supabase');

// Get all products with category information
const getProducts = async (req, res) => {
  try {
    console.log('Getting products...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Get products error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Products found:', products?.length || 0);
    res.json({ data: products || [] });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    // Assurer que additional_images est un tableau
    if (!product.additional_images) {
      product.additional_images = [];
    }
    
    console.log('Product additional_images:', product.additional_images);
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product (admin only) - DEBUG VERSION
const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Raw body:', req.body);
    console.log('Body keys:', Object.keys(req.body));
    console.log('Name value:', req.body.name, 'Type:', typeof req.body.name);
    console.log('Price value:', req.body.price, 'Type:', typeof req.body.price);
    
    // Si les données sont vides, utiliser des valeurs de test
    const hasValidData = req.body.name && req.body.name.trim() !== '';
    
    const productData = {
      name: hasValidData ? req.body.name.trim() : 'Nom par défaut',
      description: req.body.description || '',
      price: req.body.price ? parseFloat(req.body.price) : 99.99,
      promotional_price: req.body.promotional_price ? parseFloat(req.body.promotional_price) : null,
      category_id: req.body.category_id || null,
      image_url: req.body.image_url || null,
      video_url: req.body.video_url || null,
      additional_images: req.body.additional_images || [],
      is_featured: req.body.is_featured || false
    };
    
    console.log('Final product data:', productData);
    console.log('Has valid data:', hasValidData);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select('*')
      .single();

    if (error) {
      console.log('DB Error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Product created:', product);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    console.log('=== UPDATE PRODUCT ===');
    console.log('Product ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    const { name, description, price, promotional_price, category_id, image_url, video_url, is_featured } = req.body;

    const updateData = {
      name,
      description,
      price,
      promotional_price,
      category_id,
      image_url,
      video_url,
      additional_images: req.body.additional_images || [],
      is_featured
    };

    console.log('Update data:', updateData);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.log('Update error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Product updated successfully:', product);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('DELETE PRODUCT - ID:', id);

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('DELETE ERROR:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('PRODUCT DELETED SUCCESSFULLY');
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Reset all products (admin only)
const resetProducts = async (req, res) => {
  try {
    // Delete all products
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .gte('created_at', '1900-01-01');

    if (error) {
      console.error('Products delete error:', error);
      return res.status(500).json({ error: 'Failed to delete products' });
    }

    res.json({ message: 'All products reset successfully' });
  } catch (error) {
    console.error('Reset products error:', error);
    res.status(500).json({ error: 'Failed to reset products' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts
};