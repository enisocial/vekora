const { supabaseAdmin } = require('../config/supabase');

// Export products as CSV for Facebook catalog
const exportProductsCSV = async (req, res) => {
  try {
    const { data: products, error } = await supabaseAdmin
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
      return res.status(500).json({ error: error.message });
    }

    // Facebook catalog CSV headers
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'google_product_category',
      'product_type'
    ];

    // Convert products to CSV format
    const csvRows = products.map(product => {
      const price = product.promotional_price || product.price;
      const productUrl = `https://vekora.store/product/${product.id}`;
      
      return [
        product.id,
        `"${product.name}"`,
        `"${product.description || ''}"`,
        'in stock',
        'new',
        `${price} XAF`,
        productUrl,
        product.image_url || '',
        'Vekora',
        'Furniture',
        product.categories?.name || 'Mobilier'
      ].join(',');
    });

    // Create CSV content
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vekora-catalog.csv"');
    
    res.send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

module.exports = {
  exportProductsCSV
};