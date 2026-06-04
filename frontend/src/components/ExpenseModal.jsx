import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
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

const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export default function ExpenseModal({ open, onClose, onSave, expense = null }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: getLocalDateString(),
    note: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note || '',
      });
    } else {
      setFormData({
        amount: '',
        category: '',
        date: getLocalDateString(),
        note: '',
      });
    }
    setErrors({});
  }, [expense, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const todayStr = getLocalDateString();

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a number greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Invalid category selected';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date > todayStr) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 1,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {expense ? 'Edit Expense' : 'Add Expense'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={2.5}>
            {/* Amount Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="amount"
                label="Amount (₹)"
                type="number"
                inputProps={{ step: 'any', min: '0.01' }}
                value={formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                variant="outlined"
              />
            </Grid>

            {/* Category Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                error={!!errors.category}
                helperText={errors.category}
                variant="outlined"
              >
                {CATEGORIES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date Field */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Note Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="note"
                label="Note / Description"
                multiline
                rows={3}
                placeholder="What did you spend this on?"
                value={formData.note}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {expense ? 'Save Changes' : 'Add Expense'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export { CATEGORIES };
