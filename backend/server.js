require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://bharani2005-tech.github.io',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB setup
let db;
const client = new MongoClient(process.env.MONGO_URL);

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'authdb');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Node.js Hackathon Backend!' });
});

app.post('/api/status', async (req, res) => {
  try {
    const { client_name } = req.body;
    if (!client_name) return res.status(400).json({ error: 'client_name is required' });

    const statusObj = {
      id: uuidv4(),
      client_name,
      timestamp: new Date()
    };

    await db.collection('status_checks').insertOne(statusObj);
    res.status(201).json(statusObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const statusChecks = await db.collection('status_checks').find().toArray();
    res.json(statusChecks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server safely
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle port conflicts gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try changing PORT in .env`);
  } else {
    console.error(err);
  }
});

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\n🔒 Closing MongoDB connection...');
  await client.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});
