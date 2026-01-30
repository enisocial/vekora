const { supabase, supabaseAdmin } = require('../config/supabase');

// Create new order (public)
const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_phone, delivery_location, items } = req.body;

    // Validation
    if (!customer_name || !customer_phone || !delivery_location || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Customer name, phone, delivery location, and items are required'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid item data' });
      }

      // Get product price
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('price, name')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        delivery_location,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.log('Order creation error:', orderError);
      return res.status(500).json({ error: orderError.message });
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.log('Order items creation error:', itemsError);
      // If order items creation fails, delete the order
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return res.status(500).json({ error: 'Failed to create order items' });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders (admin only)
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order (admin only)
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!status || !['pending', 'confirmed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (pending or confirmed) is required' });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
};