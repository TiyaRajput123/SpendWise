import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

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

export default function BudgetModal({ open, onClose, onSave, budget = null, existingCategories = [] }) {
  const theme = useTheme();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setLimit(budget.limit);
    } else {
      // Find a category that doesn't have a budget yet
      const available = CATEGORIES.filter((cat) => !existingCategories.includes(cat));
      setCategory(available[0] || '');
      setLimit('');
    }
    setError('');
  }, [budget, open, existingCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      setError('Category is required');
      return;
    }
    if (!limit || isNaN(limit) || Number(limit) <= 0) {
      setError('Limit must be a number greater than 0');
      return;
    }

    onSave({
      category,
      limit: Number(limit),
    });
  };

  // When creating a budget, exclude already configured categories
  const availableCategories = budget
    ? [budget.category]
    : CATEGORIES.filter((cat) => !existingCategories.includes(cat) || cat === category);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 0.5,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {budget ? 'Edit Budget Limit' : 'Set Category Budget'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}`, p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              select
              required
              fullWidth
              name="category"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!budget} // Cannot change category if editing
              variant="outlined"
            >
              {availableCategories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              name="limit"
              label="Budget Limit (₹)"
              type="number"
              inputProps={{ min: '1' }}
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                if (error) setError('');
              }}
              error={!!error}
              helperText={error}
              variant="outlined"
              autoFocus
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {budget ? 'Save Limit' : 'Set Budget'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export { CATEGORIES };
