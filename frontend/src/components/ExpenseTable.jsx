import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import {
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionTableRow = motion(TableRow);

// Custom helper to style category chips
export const getCategoryStyles = (category, theme) => {
  const isDark = theme.palette.mode === 'dark';
  const colors = {
    Food: { bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#e6f4ea', color: '#10b981', dot: '#10b981' },
    Transport: { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#e8f0fe', color: '#3b82f6', dot: '#3b82f6' },
    Bills: { bg: isDark ? 'rgba(147, 51, 234, 0.15)' : '#f3e8ff', color: '#9333ea', dot: '#9333ea' },
    Entertainment: { bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', color: '#f59e0b', dot: '#f59e0b' },
    Shopping: { bg: isDark ? 'rgba(236, 72, 153, 0.15)' : '#fce7f3', color: '#ec4899', dot: '#ec4899' },
    Health: { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', dot: '#ef4444' },
    Education: { bg: isDark ? 'rgba(6, 182, 212, 0.15)' : '#ecfeff', color: '#06b6d4', dot: '#06b6d4' },
    Other: { bg: isDark ? 'rgba(100, 116, 139, 0.15)' : '#f1f5f9', color: '#64748b', dot: '#64748b' },
  };

  return colors[category] || colors.Other;
};

export default function ExpenseTable({ expenses, onEdit, onDelete, showActions = true }) {
  const theme = useTheme();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenDetail = (expense) => {
    setSelectedExpense(expense);
  };

  const handleCloseDetail = () => {
    setSelectedExpense(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (expenses.length === 0) {
    return (
      <Box sx={{ py: 6, textClassName: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
          No transactions found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Try adjusting your search query or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
        <Table sx={{ minWidth: 600 }} aria-label="expenses table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Amount</TableCell>
              {showActions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence initial={false}>
              {expenses.map((expense, index) => {
                const catStyle = getCategoryStyles(expense.category, theme);
                return (
                  <MotionTableRow
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.01)'
                          : 'rgba(255, 255, 255, 0.01)',
                      },
                    }}
                  >
                    {/* Date Column */}
                    <TableCell sx={{ fontWeight: 500 }}>
                      {formatDate(expense.date)}
                    </TableCell>

                    {/* Category Column */}
                    <TableCell>
                      <Chip
                        label={expense.category}
                        sx={{
                          backgroundColor: catStyle.bg,
                          color: catStyle.color,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          height: '24px',
                          border: `1px solid ${theme.palette.mode === 'light' ? 'transparent' : catStyle.dot}`,
                          '& .MuiChip-label': { px: 1.5 },
                        }}
                      />
                    </TableCell>

                    {/* Note Column */}
                    <TableCell sx={{ color: 'text.secondary', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {expense.note || <Typography variant="body2" component="span" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>No description</Typography>}
                    </TableCell>

                    {/* Amount Column */}
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      ₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>

                    {/* Actions Column */}
                    {showActions && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetail(expense)}
                              sx={{ color: 'text.secondary' }}
                            >
                              <VisibilityRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Expense">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(expense)}
                              sx={{ color: 'primary.main' }}
                            >
                              <EditRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Expense">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(expense.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </MotionTableRow>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={!!selectedExpense} onClose={handleCloseDetail} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Expense Transaction Details</DialogTitle>
        <DialogContent dividers>
          {selectedExpense && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Amount</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  ₹{selectedExpense.amount.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Category</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedExpense.category}
                    sx={{
                      backgroundColor: getCategoryStyles(selectedExpense.category, theme).bg,
                      color: getCategoryStyles(selectedExpense.category, theme).color,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDate(selectedExpense.date)} ({selectedExpense.date})
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Note / Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                  {selectedExpense.note || 'No note added to this transaction.'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this expense transaction? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmId(null)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
