const { supabaseAdmin } = require('../config/supabase');

// Track visitor
const trackVisitor = async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    const today = new Date().toISOString().split('T')[0];

    // Check if visitor already tracked today
    const { data: existing } = await supabaseAdmin
      .from('visitors')
      .select('id')
      .eq('ip_address', ip)
      .eq('visit_date', today)
      .single();

    if (!existing) {
      // Track new visitor for today
      await supabaseAdmin
        .from('visitors')
        .insert({
          ip_address: ip,
          user_agent: userAgent,
          visit_date: today
        });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Track visitor error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

// Get visitor stats
const getVisitorStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Today's visitors
    const { data: todayVisitors, count: todayCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact' })
      .eq('visit_date', today);

    // Total visitors
    const { count: totalCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact' });

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: weekCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact' })
      .gte('visit_date', sevenDaysAgo.toISOString().split('T')[0]);

    res.json({
      today: todayCount || 0,
      total: totalCount || 0,
      week: weekCount || 0
    });
  } catch (error) {
    console.error('Get visitor stats error:', error);
    res.status(500).json({ error: 'Failed to get visitor stats' });
  }
};

module.exports = {
  trackVisitor,
  getVisitorStats
};