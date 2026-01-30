const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test works!' });
});

app.get('/api/products', (req, res) => {
  res.json({ data: [] });
});

app.get('/api/categories', (req, res) => {
  res.json([]);
});

app.get('/api/hero-video', (req, res) => {
  res.json({ video_url: null });
});

app.get('/api/whatsapp', (req, res) => {
  res.json({ phone_number: '', message_template: '', is_active: false });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});