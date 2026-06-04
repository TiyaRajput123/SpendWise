const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getBudgets, saveBudgets } = require('../utils/db');

const CATEGORIES = [
  'Food', 'Transport', 'Bills', 'Entertainment', 
  'Shopping', 'Health', 'Education', 'Other'
];

// GET all budgets
router.get('/', (req, res) => {
  try {
    const budgets = getBudgets();
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to retrieve budgets' });
  }
});

// POST create budget
router.post('/', (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Category is required and must be one of: ${CATEGORIES.join(', ')}` });
    }
    if (limit === undefined || limit === null || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Limit must be a number greater than 0' });
    }

    const budgets = getBudgets();
    
    // Check if budget for category already exists
    const existing = budgets.find(b => b.category === category);
    if (existing) {
      return res.status(400).json({ error: `Budget for category '${category}' already exists. Use PUT to update it.` });
    }

    const newBudget = {
      id: uuidv4(),
      category,
      limit: Number(limit)
    };

    budgets.push(newBudget);
    saveBudgets(budgets);

    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// PUT update budget
router.put('/:id', (req, res) => {
  try {
    const { limit } = req.body;
    const budgets = getBudgets();
    const index = budgets.findIndex(b => b.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (limit === undefined || limit === null || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Limit must be a number greater than 0' });
    }

    budgets[index].limit = Number(limit);
    saveBudgets(budgets);

    res.json(budgets[index]);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

module.exports = router;
