const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Initialize Firebase Admin with service account
// Initialize Firebase Admin
// On Vercel, the service account key is stored as an environment variable.
// Locally, it will fall back to the JSON file.
let db;
let firebaseError = null;

try {
  if (admin.apps.length === 0) {
    if (!process.env.SERVICE_ACCOUNT_KEY || !process.env.FIREBASE_DATABASE_URL) {
      throw new Error('Firebase environment variables (SERVICE_ACCOUNT_KEY, FIREBASE_DATABASE_URL) are not set.');
    }
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  db = admin.database();
} catch (error) {
  console.error('FATAL: Firebase initialization failed:', error.message);
  firebaseError = error.message;
}

// Middleware to check for Firebase initialization errors on every request
app.use((req, res, next) => {
  if (firebaseError) {
    return res.status(500).json({ error: 'Firebase initialization failed. Please check server logs.', details: firebaseError });
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the 'eaters' directory
app.use(express.static('eaters'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  if (firebaseError) {
    return res.status(500).json({ status: 'error', message: 'Firebase connection failed' });
  }
  res.status(200).json({ status: 'ok', message: 'Server is running and Firebase is connected' });
});

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'eaters', 'index.html'));
});

// Routes
// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menuRef = db.ref('menu');
    const snapshot = await menuRef.once('value');
    res.json(snapshot.val() || {});
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Place a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount, customerInfo } = req.body;

    // Basic validation
    if (!items || !totalAmount || !customerInfo) {
      return res.status(400).json({ error: 'Missing order details. Required fields: items, totalAmount, customerInfo' });
    }

    const ordersRef = db.ref('orders');
    const newOrderRef = ordersRef.push();
    
    await newOrderRef.set({
      items,
      totalAmount,
      customerInfo,
      status: 'pending',
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    res.status(201).json({ 
      orderId: newOrderRef.key,
      message: 'Order placed successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get order status
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderRef = db.ref(`orders/${orderId}`);
    const snapshot = await orderRef.once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Export the app for Vercel
module.exports = app;
