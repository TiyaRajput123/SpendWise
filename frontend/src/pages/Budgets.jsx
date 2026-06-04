import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress,
  Stack,
  CircularProgress,
  Chip,
  useTheme,
  linearProgressClasses,
} from '@mui/material';
import {
  EditRounded,
  AddRounded,
  WarningRounded,
  CheckCircleRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { budgetService, expenseService } from '../services/api';
import BudgetModal from '../components/BudgetModal';
import { CATEGORIES } from './Expenses';
import { getCategoryStyles } from '../components/ExpenseTable';
import { motion } from 'framer-motion';

const MotionGridItem = motion(Grid);

const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export default function Budgets() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [budData, expData] = await Promise.all([
        budgetService.getAll(),
        expenseService.getAll(),
      ]);
      setBudgets(budData);
      setExpenses(expData);
    } catch (error) {
      console.error('Failed to load budgets data:', error);
      toast.error('Could not load budget logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Aggregate current month spending for a category
  const getSpentForCategory = (category) => {
    const currentMonth = getLocalDateString().substring(0, 7); // YYYY-MM
    return expenses
      .filter((e) => e.category === category && e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setModalOpen(true);
  };

  const handleCreateBudget = () => {
    setSelectedBudget(null);
    setModalOpen(true);
  };

  const handleSaveBudget = async (data) => {
    try {
      if (selectedBudget) {
        // Edit budget limit
        await budgetService.update(selectedBudget.id, { limit: data.limit });
        toast.success(`Updated ${data.category} budget limit!`);
      } else {
        // Create budget limit
        await budgetService.create(data);
        toast.success(`Set budget for ${data.category}!`);
      }
      setModalOpen(false);
      setSelectedBudget(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save budget:', error);
      const errMsg = error.response?.data?.error || 'Failed to save budget.';
      toast.error(errMsg);
    }
  };

  const getProgressColor = (percent) => {
    if (percent > 90) return theme.palette.error.main;   // Red
    if (percent > 70) return theme.palette.warning.main; // Yellow/Amber
    return theme.palette.success.main;                   // Green
  };

  // Compile active budgets and build a list for all default categories
  const budgetList = CATEGORIES.map((cat) => {
    const activeBudget = budgets.find((b) => b.category === cat);
    const spent = getSpentForCategory(cat);
    
    return {
      category: cat,
      budget: activeBudget || null,
      spent,
      limit: activeBudget ? activeBudget.limit : 0,
      remaining: activeBudget ? activeBudget.limit - spent : 0,
      percent: activeBudget ? Math.round((spent / activeBudget.limit) * 100) : 0,
    };
  });

  const existingCategories = budgets.map((b) => b.category);

  return (
    <Box sx={{ py: 2}}>
      {/* Title Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.8px', mb: 0.5 }}>
            Budgeting Board
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set and track expense thresholds per category. Progress evaluates current month spending.
          </Typography>
        </Box>
        {existingCategories.length < CATEGORIES.length && (
          <Button
            variant="contained"
            onClick={handleCreateBudget}
            startIcon={<AddRounded />}
            sx={{ fontWeight: 750 }}
          >
            Create Budget
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {budgetList.map((item, index) => {
            const catStyle = getCategoryStyles(item.category, theme);
            const isExceeded = item.limit > 0 && item.spent > item.limit;
            const hasBudget = item.budget !== null;

            return (
              <MotionGridItem
                item
                xs={12}
                md={6}
                key={item.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    {/* Top Row: Category Label & Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: catStyle.color }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {item.category}
                        </Typography>
                      </Box>
                      {hasBudget ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditRounded />}
                          onClick={() => handleEditBudget(item.budget)}
                          sx={{ py: 0.6, px: 1.2 }}
                        >
                          Modify Limit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<AddRounded />}
                          onClick={() => handleEditBudget({ category: item.category, limit: 0 })}
                          sx={{ py: 0.5, px: 1.2 }}
                        >
                          Set Limit
                        </Button>
                      )}
                    </Box>

                    {/* Mid Section: Statistics */}
                    {hasBudget ? (
                      <Box sx={{ my: 1 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Spent</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>
                              ₹{item.spent.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Budget Limit</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                              ₹{item.limit.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Remaining</Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 800,
                                color: item.remaining >= 0 ? 'success.main' : 'error.main',
                              }}
                            >
                              ₹{Math.abs(item.remaining).toLocaleString()}
                              {item.remaining < 0 && ' over'}
                            </Typography>
                          </Grid>
                        </Grid>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 3, mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: getProgressColor(item.percent) }}>
                              {item.percent}% used
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current Month
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(item.percent, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: theme.palette.mode === 'light' ? '#e2e8f0' : '#1e293b',
                              [`& .${linearProgressClasses.bar}`]: {
                                borderRadius: 4,
                                backgroundColor: getProgressColor(item.percent),
                                transition: 'transform 0.4s ease',
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ py: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No spending threshold configured for {item.category}
                        </Typography>
                      </Box>
                    )}

                    {/* Bottom Status Tags */}
                    {hasBudget && (
                      <Box sx={{ mt: 1, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                        {isExceeded ? (
                          <Chip
                            icon={<WarningRounded sx={{ fontSize: '16px !important' }} />}
                            label={`Overbudget by ₹${Math.abs(item.remaining).toLocaleString()}!`}
                            color="error"
                            size="small"
                            sx={{ borderRadius: '6px', fontWeight: 600 }}
                          />
                        ) : item.percent >= 70 ? (
                          <Chip
                            icon={<WarningRounded sx={{ fontSize: '16px !important' }} />}
                            label="Approaching budget limit"
                            color="warning"
                            size="small"
                            sx={{ borderRadius: '6px', fontWeight: 600 }}
                          />
                        ) : (
                          <Chip
                            icon={<CheckCircleRounded sx={{ fontSize: '16px !important' }} />}
                            label="On track - Good standing"
                            color="success"
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: '6px', fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </MotionGridItem>
            );
          })}
        </Grid>
      )}

      {/* Edit/Create Modal */}
      <BudgetModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBudget(null);
        }}
        onSave={handleSaveBudget}
        budget={selectedBudget}
        existingCategories={existingCategories}
      />
    </Box>
  );
}
