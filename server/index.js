import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import subscriptionRoutes from './routes/subscriptions.js';
import trainingRoutes from './routes/training.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../client');
const clientDistDir = path.resolve(clientDir, 'dist');

const app = express();
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security headers configured for iframe embedding in preview environments
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  frameguard: false,
}));

// Ensure frame embedding is permitted for AI Studio iframe preview
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Mount Routes FIRST
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/training', trainingRoutes);

// Global Error Handler for API routes
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Setup Frontend serving (Vite in dev, static dist in production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        root: clientDir,
        configFile: path.join(clientDir, 'vite.config.js'),
        server: {
          middlewareMode: true,
          host: '0.0.0.0',
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Mounted Vite development middleware');
    } catch (err) {
      console.warn('Vite middleware could not be initialized, falling back to static files:', err.message);
      if (fs.existsSync(clientDistDir)) {
        app.use(express.static(clientDistDir));
        app.get('*', (req, res) => {
          res.sendFile(path.join(clientDistDir, 'index.html'));
        });
      }
    }
  } else {
    if (fs.existsSync(clientDistDir)) {
      app.use(express.static(clientDistDir));
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
