const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getExpenses, saveExpenses } = require('../utils/db');

const CATEGORIES = [
  'Food', 'Transport', 'Bills', 'Entertainment', 
  'Shopping', 'Health', 'Education', 'Other'
];

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// GET all expenses (with filters)
router.get('/', (req, res) => {
  try {
    let expenses = getExpenses();
    const { category, dateRange, search } = req.query;

    if (category) {
      expenses = expenses.filter(e => e.category === category);
    }

    if (dateRange) {
      const today = new Date();
      const localTodayStr = getLocalDateString();
      if (dateRange === 'thisMonth') {
        const currentMonth = localTodayStr.substring(0, 7); // YYYY-MM
        expenses = expenses.filter(e => e.date.startsWith(currentMonth));
      } else if (dateRange === 'lastMonth') {
        // Calculate last month YYYY-MM
        let year = today.getFullYear();
        let month = today.getMonth(); // 0-indexed, so current month is month (e.g. 5 for June)
        // Previous month is month - 1, which means month is month (since we want 1-indexed number of previous month)
        // If current month is 0 (January), last month is 12 (December) of previous year
        if (month === 0) {
          month = 12;
          year = year - 1;
        }
        const lastMonthStr = `${year}-${String(month).padStart(2, '0')}`;
        expenses = expenses.filter(e => e.date.startsWith(lastMonthStr));
      } else if (dateRange.includes(',')) {
        const [start, end] = dateRange.split(',');
        expenses = expenses.filter(e => e.date >= start && e.date <= end);
      }
    }

    if (search) {
      const term = search.toLowerCase();
      expenses = expenses.filter(e => 
        (e.note && e.note.toLowerCase().includes(term)) || 
        e.category.toLowerCase().includes(term)
      );
    }

    // Sort by date descending
    expenses.sort((a, b) => b.date.localeCompare(a.date));

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
});

// GET single expense
router.get('/:id', (req, res) => {
  try {
    const expenses = getExpenses();
    const expense = expenses.find(e => e.id === req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expense' });
  }
});

// POST create expense
router.post('/', (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a number greater than 0' });
    }
    if (!category || !CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Category is required and must be one of: ${CATEGORIES.join(', ')}` });
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const todayStr = getLocalDateString();
    if (date > todayStr) {
      return res.status(400).json({ error: 'Future dates are not allowed' });
    }

    const expenses = getExpenses();
    const newExpense = {
      id: uuidv4(),
      amount: Number(amount),
      category,
      date,
      note: note || ''
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

// PUT update expense
router.put('/:id', (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const expenses = getExpenses();
    const index = expenses.findIndex(e => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({ error: 'Amount must be a number greater than 0' });
    }
    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${CATEGORIES.join(', ')}` });
    }
    if (date) {
      const todayStr = getLocalDateString();
      if (date > todayStr) {
        return res.status(400).json({ error: 'Future dates are not allowed' });
      }
    }

    const updatedExpense = {
      ...expenses[index],
      amount: amount !== undefined ? Number(amount) : expenses[index].amount,
      category: category || expenses[index].category,
      date: date || expenses[index].date,
      note: note !== undefined ? note : expenses[index].note
    };

    expenses[index] = updatedExpense;
    saveExpenses(expenses);

    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE expense
router.delete('/:id', (req, res) => {
  try {
    const expenses = getExpenses();
    const filtered = expenses.filter(e => e.id !== req.params.id);

    if (expenses.length === filtered.length) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    saveExpenses(filtered);
    res.json({ message: 'Expense deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
