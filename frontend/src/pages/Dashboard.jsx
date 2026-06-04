import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalanceWalletRounded,
  CalendarMonthRounded,
  TrendingUpRounded,
  FavoriteRounded,
  ArrowForwardRounded,
  AutoAwesomeRounded,
} from '@mui/icons-material';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { analyticsService, expenseService } from '../services/api';
import StatCard from '../components/StatCard';
import ExpenseTable, { getCategoryStyles } from '../components/ExpenseTable';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Food: '#10b981', // Emerald
  Transport: '#3b82f6', // Blue
  Bills: '#9333ea', // Purple
  Entertainment: '#f59e0b', // Amber
  Shopping: '#ec4899', // Pink
  Health: '#ef4444', // Red
  Education: '#06b6d4', // Cyan
  Other: '#64748b', // Slate
};

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumData, expData, insData] = await Promise.all([
        analyticsService.getSummary(),
        expenseService.getAll(),
        analyticsService.getInsights(),
      ]);
      setSummary(sumData);
      setExpenses(expData);
      setInsights(insData);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format YYYY-MM into MMM YYYY for chart (e.g. 2026-06 -> Jun 2026)
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
  };

  // 1. Prepare Category Pie Chart Data (for current month)
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
  
  const categoryMap = {};
  thisMonthExpenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  // 2. Prepare Monthly Bar Chart Data
  const monthlyMap = {};
  expenses.forEach(e => {
    const month = e.date.substring(0, 7); // YYYY-MM
    monthlyMap[month] = (monthlyMap[month] || 0) + e.amount;
  });

  const barData = Object.entries(monthlyMap)
    .map(([month, total]) => ({
      month,
      formattedMonth: formatMonth(month),
      total,
    }))
    .sort((a, b) => a.month.localeCompare(b.month)); // Sort chronologically

  // Custom Pie Chart tooltip
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
            ₹{data.value.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {summary?.thisMonthSpent ? `${Math.round((data.value / summary.thisMonthSpent) * 100)}% of month` : ''}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom Bar Chart tooltip
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {data.formattedMonth}
          </Typography>
          <Typography variant="body2" color="secondary" sx={{ fontWeight: 700 }}>
            Spent: ₹{data.total.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Title Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.8px', mb: 0.5 }}>
            Financial Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's a premium summary of your financial status and budgets.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/expenses')}
          endIcon={<ArrowForwardRounded />}
          sx={{ py: 1.2, px: 2.5 }}
        >
          Manage Expenses
        </Button>
      </Box>

      {/* Row 1: KPI Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL SPENT"
            value={summary ? `₹${summary.totalSpent.toLocaleString()}` : '₹0'}
            icon={<AccountBalanceWalletRounded sx={{ color: '#4f46e5' }} />}
            iconBg="rgba(79, 70, 229, 0.1)"
            subtext={`Across ${summary?.totalTransactions || 0} transaction(s)`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="THIS MONTH"
            value={summary ? `₹${summary.thisMonthSpent.toLocaleString()}` : '₹0'}
            icon={<CalendarMonthRounded sx={{ color: '#9333ea' }} />}
            iconBg="rgba(147, 51, 234, 0.1)"
            subtext={`Daily Avg: ₹${summary?.averageDailySpending?.toLocaleString() || 0}`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="HIGHEST EXPENSE"
            value={summary?.highestExpense ? `₹${summary.highestExpense.amount.toLocaleString()}` : '₹0'}
            icon={<TrendingUpRounded sx={{ color: '#f59e0b' }} />}
            iconBg="rgba(245, 158, 11, 0.1)"
            subtext={summary?.highestExpense ? `${summary.highestExpense.category} - ${summary.highestExpense.note || 'No details'}` : 'No transactions'}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="HEALTH SCORE"
            value={summary ? `${summary.healthScore}/100` : '0/100'}
            icon={<FavoriteRounded sx={{ color: summary ? getScoreColor(summary.healthScore) : '#ef4444' }} />}
            iconBg={summary ? `${getScoreColor(summary.healthScore)}1A` : 'rgba(239, 68, 68, 0.1)'}
            trend={summary?.healthScore >= 80 ? 'Good' : summary?.healthScore >= 60 ? 'Warning' : 'Risky'}
            trendColor={summary ? getScoreColor(summary.healthScore) : 'error.main'}
            subtext="Based on budget tracking"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Row 2: Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Pie Chart */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Category Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This month's relative categories spending.
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : pieData.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">No expenses for this month yet.</Typography>
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1, height: 260, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Monthly Spending
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Historical view of total expenses per calendar month.
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : barData.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">Add expenses to view monthly aggregates.</Typography>
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1, height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ left: -10, right: 10 }}>
                      <XAxis dataKey="formattedMonth" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ fill: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, index) => {
                          const isCurrentMonth = entry.month === currentMonthStr;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={isCurrentMonth 
                                ? 'url(#activeMonthGrad)' 
                                : theme.palette.mode === 'light' ? '#cbd5e1' : '#1e293b'
                              }
                            />
                          );
                        })}
                      </Bar>
                      <defs>
                        <linearGradient id="activeMonthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: AI Financial Insights Sneak Peek */}
      <Card sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '100%',
            background: 'linear-gradient(225deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <CardContent sx={{ p: 4, zIndex: 2, position: 'relative' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={9}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AutoAwesomeRounded sx={{ color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Smart AI Financial Insights
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '800px' }}>
                {loading
                  ? 'Calculating financial insights...'
                  : insights?.smartAlerts?.[0]?.message ||
                    insights?.spendingAnalysis?.[0] ||
                    'Complete your profile and add transactions to receive personalized tips.'}
              </Typography>
              {!loading && insights?.moneySavingTips?.[0] && (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  💡 Tip: {insights.moneySavingTips[0]}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/insights')}
                sx={{
                  borderWidth: '1.5px',
                  fontWeight: 700,
                  '&:hover': { borderWidth: '1.5px' },
                }}
              >
                View Full Insights
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Row 4: Recent Expenses */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Recent Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest 5 expense items across all categories.
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => navigate('/expenses')}
              endIcon={<ArrowForwardRounded />}
              sx={{ fontWeight: 700 }}
            >
              See All
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <ExpenseTable
              expenses={expenses.slice(0, 5)}
              showActions={false}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
