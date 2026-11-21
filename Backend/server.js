import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadsDir } from './config/upload.js';
import { isSupabaseConfigured } from './config/db.js';

// Modular Route Handlers
import systemRoutes from './routes/systemRoutes.js';
import sareeRoutes from './routes/sareeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file serving for saree images
app.use('/uploads', express.static(uploadsDir));

// API Endpoints
app.use('/api', systemRoutes);
app.use('/api/sarees', sareeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Nandani Batik Backend API running on port ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Supabase Configured: ${isSupabaseConfigured()}`);
  console.log(` Mode: ${isSupabaseConfigured() ? 'Supabase' : 'Local JSON Database'}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`Another terminal or background server is already running on port ${PORT}.\n`);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
