import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  AddRounded,
  DownloadRounded,
  FilterListRounded,
  ClearAllRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { expenseService, budgetService } from '../services/api';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseModal from '../components/ExpenseModal';
import { exportToCSV } from '../utils/csvExport';

const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Other',
];

const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export default function Expenses({ searchQuery }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(getLocalDateString());

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build API request parameters
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (searchQuery) params.search = searchQuery;

      if (dateRangeFilter === 'thisMonth') {
        params.dateRange = 'thisMonth';
      } else if (dateRangeFilter === 'lastMonth') {
        params.dateRange = 'lastMonth';
      } else if (dateRangeFilter === 'custom' && startDate && endDate) {
        params.dateRange = `${startDate},${endDate}`;
      }

      const [expData, budData] = await Promise.all([
        expenseService.getAll(params),
        budgetService.getAll(),
      ]);
      
      setExpenses(expData);
      setBudgets(budData);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      toast.error('Could not load transactions.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dateRangeFilter, startDate, endDate, searchQuery]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleClearFilters = () => {
    setCategoryFilter('');
    setDateRangeFilter('all');
    setStartDate('');
    setEndDate(getLocalDateString());
    toast.success('Filters cleared.');
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // Helper to check and alert if a budget is exceeded
  const checkBudgetLimit = async (category, newAmount, expenseId = null) => {
    try {
      const budget = budgets.find((b) => b.category === category);
      if (!budget) return;

      // Get current spending for this category this month
      const currentMonthStr = getLocalDateString().substring(0, 7);
      const allExpenses = await expenseService.getAll();
      
      let currentCategorySpent = allExpenses
        .filter((e) => e.category === category && e.date.startsWith(currentMonthStr))
        // Exclude the current expense amount if editing, to get proper calculation
        .filter((e) => e.id !== expenseId)
        .reduce((sum, e) => sum + e.amount, 0);

      const updatedSpent = currentCategorySpent + newAmount;

      if (updatedSpent > budget.limit) {
        const excess = updatedSpent - budget.limit;
        toast((t) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#b91c1c' }}>
              ⚠️ Budget Exceeded Alert!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {category} spending is at ₹{updatedSpent} (Limit: ₹{budget.limit}). You are over by ₹{excess}.
            </Typography>
          </Box>
        ), {
          duration: 6000,
          icon: '⚠️',
          style: {
            border: '1px solid #fee2e2',
            padding: '12px',
            color: '#7f1d1d',
            background: '#fef2f2',
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveExpense = async (data) => {
    try {
      if (editingExpense) {
        // Edit flow
        const updated = await expenseService.update(editingExpense.id, data);
        toast.success('Expense updated successfully');
        await checkBudgetLimit(data.category, data.amount, editingExpense.id);
      } else {
        // Add flow
        const created = await expenseService.create(data);
        toast.success('Expense added successfully');
        await checkBudgetLimit(data.category, data.amount);
      }
      handleCloseModal();
      fetchExpenses();
    } catch (error) {
      console.error('Failed to save expense:', error);
      const errMsg = error.response?.data?.error || 'Failed to save expense.';
      toast.error(errMsg);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense.');
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.error('No visible expenses to export.');
      return;
    }
    exportToCSV(expenses);
    toast.success(`Exported ${expenses.length} transaction(s) to expenses.csv`);
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Title Area */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.8px', mb: 0.5 }}>
            Expenses Log
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your day-to-day transactions and log new items.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2.5}>
          <Button
            variant="outlined"
            onClick={handleExportCSV}
            startIcon={<DownloadRounded />}
            sx={{ border: `1.5px solid ${theme.palette.divider}`, fontWeight: 700, '&:hover': { borderWidth: '1.5px' } }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenAddModal}
            startIcon={<AddRounded />}
            sx={{ fontWeight: 750 }}
          >
            Add Expense
          </Button>
        </Stack>
      </Box>

      {/* Row 2: Filtering Board */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2.5} alignItems="center">
            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Category Filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date Range Predefined */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Timeframe"
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="all">All-time</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="custom">Custom Date Range</MenuItem>
              </TextField>
            </Grid>

            {/* Custom Dates Inputs */}
            {dateRangeFilter === 'custom' && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>
            )}

            {/* Buttons stack */}
            <Grid item xs={12} md={dateRangeFilter === 'custom' ? 2 : 6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {(categoryFilter || dateRangeFilter !== 'all' || searchQuery) && (
                <Button
                  variant="text"
                  color="error"
                  onClick={handleClearFilters}
                  startIcon={<ClearAllRounded />}
                  sx={{ fontWeight: 700 }}
                >
                  Clear Filters
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Row 3: Expenses Table Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteExpense}
              showActions={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </Box>
  );
}
export { CATEGORIES };
