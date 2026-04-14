const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const tagRoutes = require('./routes/tags');
const versionRoutes = require('./routes/versions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://stirring-biscochitos-00d63b.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/versions', versionRoutes);

// Serve Static Files in Production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all route for React SPA (Robust Middleware)
app.use((req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
