import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';

import experienceRoutes from './routes/experienceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'HobbyHub API', 
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date() 
  });
});

// Serve frontend in production or if build dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.send('HobbyHub Backend API is running. Build client using "npm run build".');
    }
  });
});

// Connect Database & Start Server
async function startServer() {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      console.log(' Connecting to MongoDB Atlas / External Database...');
      await mongoose.connect(mongoUri);
      console.log(' Connected successfully to MongoDB Atlas.');
    } else {
      console.log(' No MONGODB_URI found in environment. Starting embedded MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(' Connected to MongoDB (Local Memory Server).');
    }

    // Seed database if empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(` HobbyHub Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Database Connection Error:', error.message);
    console.error(' Please ensure MONGODB_URI is valid in your .env file or environment variables.');
    process.exit(1);
  }
}

startServer();
