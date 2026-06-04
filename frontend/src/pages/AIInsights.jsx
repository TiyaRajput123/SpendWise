import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Stack,
  Divider,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Chip,
} from '@mui/material';
import {
  AutoAwesomeRounded,
  TrendingDownRounded,
  LightbulbRounded,
  WarningRounded,
  CheckCircleOutlineRounded,
  BookmarkAddedRounded,
  TrendingUpRounded,
  NotificationsActiveRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { analyticsService, budgetService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

export default function AIInsights() {
  const theme = useTheme();
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState(null);
  const [budgets, setBudgets] = useState([]);

  const loadData = async () => {
    try {
      const [insData, budData] = await Promise.all([
        analyticsService.getInsights(),
        budgetService.getAll(),
      ]);
      setInsights(insData);
      setBudgets(budData);
    } catch (error) {
      console.error('Failed to load insights:', error);
      toast.error('Could not fetch financial analytics data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate smart computation animation delay
    setTimeout(async () => {
      await loadData();
      setGenerating(false);
      toast.success('Smart AI Insights recalculated successfully!');
    }, 1200);
  };

  const handleApplyRecommendation = async (category, limit) => {
    try {
      const existing = budgets.find((b) => b.category === category);
      if (existing) {
        await budgetService.update(existing.id, { limit });
        toast.success(`Updated ${category} budget to ₹${limit}!`);
      } else {
        await budgetService.create({ category, limit });
        toast.success(`Set ${category} budget to ₹${limit}!`);
      }
      loadData(); // Reload budgets
    } catch (e) {
      console.error(e);
      toast.error('Failed to apply budget recommendation.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // Green
    if (score >= 70) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getAlertIcon = (type) => {
    if (type === 'warning') return <WarningRounded color="error" />;
    if (type === 'trend_increase') return <TrendingUpRounded color="warning" />;
    return <NotificationsActiveRounded color="info" />;
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Title Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.8px', mb: 0.5 }}>
            AI Financial Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalized metrics and automated recommendations based on your spending history.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerate}
          disabled={generating}
          startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeRounded />}
          sx={{
            py: 1.2,
            px: 2.5,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
            },
          }}
        >
          {generating ? 'Analyzing Details...' : 'Generate Insights'}
        </Button>
      </Box>

      {generating ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 2 }}>
          <CircularProgress size={50} color="secondary" />
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Analyzing transaction distributions...
          </Typography>
        </Box>
      ) : insights ? (
        <Grid container spacing={3.5}>
          {/* Health Score Circular Widget */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3 }}>
              <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Financial Health
                </Typography>
                
                {/* Circular Indicator */}
                <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={140}
                    thickness={5}
                    sx={{ color: theme.palette.mode === 'light' ? '#cbd5e1' : '#1e293b' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={insights.healthScore}
                    size={140}
                    thickness={5}
                    sx={{
                      color: getScoreColor(insights.healthScore),
                      position: 'absolute',
                      left: 0,
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h3" component="div" sx={{ fontWeight: 800, letterSpacing: '-2px' }}>
                      {insights.healthScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 750, letterSpacing: '1px' }}>
                      OUT OF 100
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Chip
                    label={insights.healthScore >= 85 ? 'Healthy' : insights.healthScore >= 70 ? 'Fair' : 'Needs Review'}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: `${getScoreColor(insights.healthScore)}1A`,
                      color: getScoreColor(insights.healthScore),
                      mb: 1.5,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '240px', mx: 'auto' }}>
                    {insights.scoreDetails}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Spending Analysis & Saving Tips */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
              {/* Spending Breakdown card */}
              <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingDownRounded color="primary" /> Spending Analysis
                  </Typography>
                  <Stack spacing={1.5}>
                    {insights.spendingAnalysis.map((item, idx) => (
                      <Box key={idx} sx={{ p: 2, borderRadius: '8px', borderLeft: `4px solid ${theme.palette.primary.main}`, backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#0d1527' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Savings Tips card */}
              <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbRounded sx={{ color: '#fbbf24' }} /> Saving Tips
                  </Typography>
                  <Stack spacing={1.5}>
                    {insights.moneySavingTips.map((tip, idx) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <CheckCircleOutlineRounded color="success" sx={{ fontSize: 20, mt: 0.2 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {tip}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Smart Alerts */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Alerts & Trends
                </Typography>
                
                {insights.smartAlerts.length === 0 ? (
                  <Alert severity="success" icon={<CheckCircleOutlineRounded sx={{ color: '#10b981' }} />} sx={{ borderRadius: '10px' }}>
                    <AlertTitle sx={{ fontWeight: 700 }}>All budgets are on track</AlertTitle>
                    No overspending or significant budget warnings detected this month.
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {insights.smartAlerts.map((alert, idx) => (
                      <Alert
                        key={idx}
                        severity={alert.type === 'warning' ? 'error' : alert.type === 'trend_increase' ? 'warning' : 'info'}
                        icon={getAlertIcon(alert.type)}
                        sx={{
                          borderRadius: '10px',
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#131c2e',
                          '& .MuiAlert-message': { width: '100%' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {alert.message}
                          </Typography>
                          <Chip
                            label={alert.category}
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: '4px', fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Alert>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recommended Budgets */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Recommended Budget Limits
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Smart thresholds computed based on your actual transaction records. Set these limits to enhance financial score.
                </Typography>

                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Current Budget Limit</TableCell>
                        <TableCell>Recommended Limit</TableCell>
                        <TableCell>Rationale</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {insights.budgetRecommendations.map((rec) => {
                        const currentBudget = budgets.find((b) => b.category === rec.category);
                        const isMatch = currentBudget && currentBudget.limit === rec.recommendedLimit;

                        return (
                          <TableRow key={rec.category}>
                            <TableCell sx={{ fontWeight: 700 }}>{rec.category}</TableCell>
                            <TableCell>
                              {currentBudget ? `₹${currentBudget.limit.toLocaleString()}` : 'Not set'}
                            </TableCell>
                            <TableCell sx={{ color: 'primary.main', fontWeight: 800 }}>
                              ₹{rec.recommendedLimit.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.825rem' }}>{rec.reason}</TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant={isMatch ? 'outlined' : 'contained'}
                                color={isMatch ? 'inherit' : 'primary'}
                                disabled={isMatch}
                                startIcon={isMatch ? <BookmarkAddedRounded /> : null}
                                onClick={() => handleApplyRecommendation(rec.category, rec.recommendedLimit)}
                                sx={{ py: 0.5, fontSize: '0.75rem' }}
                              >
                                {isMatch ? 'Applied' : 'Apply Recommendation'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">Recalculate or add transactions to review insights.</Typography>
        </Box>
      )}
    </Box>
  );
}
