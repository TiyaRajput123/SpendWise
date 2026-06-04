const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./utils/db');

const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database structure
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api', analyticsRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SpendWise API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`SpendWise Backend running on port ${PORT}`);
});
