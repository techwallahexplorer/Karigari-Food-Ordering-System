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
try {
  if (admin.apps.length === 0) { // Prevent re-initializing Firebase
    if (process.env.SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // This block is for local development
      const serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://foodorder-8a5e6-default-rtdb.firebaseio.com'
      });
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  // If Firebase fails to initialize, respond to all requests with an error
  app.use((req, res, next) => {
    res.status(500).json({ error: 'Firebase initialization failed. Check server logs.' });
  });
}

const db = admin.database();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the 'eaters' directory
app.use(express.static('eaters'));

// Add a route for the root path to serve index.html
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
