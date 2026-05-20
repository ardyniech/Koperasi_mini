const express = require('express');
const path = require('path');
const app = express();
const PORT = 5173;

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
