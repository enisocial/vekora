const { supabase, supabaseAdmin } = require('../config/supabase');

// Get all categories
const getCategories = async (req, res) => {
  try {
    console.log('Getting categories...');
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.log('Get categories error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Categories found:', categories?.length || 0);
    res.json(categories || []);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get single category by ID
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create new category (admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    console.log('Backend - Creating category with:', { name, description, image_url });

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const categoryData = {
      name,
      description
    };

    if (image_url) {
      categoryData.image_url = image_url;
    }

    console.log('Backend - Final category data:', categoryData);

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Category name already exists' });
      }
      return res.status(500).json({ error: error.message });
    }

    console.log('Backend - Created category:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category (admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const updateData = {
      name,
      description
    };

    if (image_url !== undefined) {
      updateData.image_url = image_url;
    }

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Category not found' });
      }
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Category name already exists' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category (admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const { data: products, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (checkError) {
      return res.status(500).json({ error: checkError.message });
    }

    if (products && products.length > 0) {
      return res.status(409).json({ error: 'Cannot delete category with existing products' });
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};