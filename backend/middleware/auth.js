const { supabaseAdmin } = require('../config/supabase');

// Middleware to verify admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware - missing or invalid header');
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Auth middleware - token length:', token.length);

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.log('Auth middleware - token verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.log('Auth middleware - user verified:', user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to verify if user is admin by checking admins table
const verifyAdminRole = async (req, res, next) => {
  try {
    console.log('Admin verification - checking user:', req.user.id);
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('id', req.user.id)
      .single();

    if (error || !admin) {
      console.log('Admin verification - failed:', error);
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('Admin verification - success');
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: 'Admin verification failed' });
  }
};

module.exports = {
  requireAdmin,
  verifyAdminRole
};