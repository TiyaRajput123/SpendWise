const express = require('express');
const router = express.Router();
const { getExpenses, getBudgets } = require('../utils/db');

const getLocalDateInfo = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  
  return {
    todayStr: `${year}-${month}-${date}`,
    currentMonthStr: `${year}-${month}`,
    currentDay: d.getDate()
  };
};


// GET /api/summary - Dashboard high-level statistics
router.get('/summary', (req, res) => {
  try {
    const expenses = getExpenses();
    const budgets = getBudgets();
    const { todayStr, currentMonthStr, currentDay } = getLocalDateInfo();

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTransactions = expenses.length;

    // Filter expenses for this month
    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
    const thisMonthSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Highest expense overall
    let highestExpense = null;
    if (expenses.length > 0) {
      highestExpense = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
    }

    // Most used category (by transaction count)
    const categoryCounts = {};
    expenses.forEach(e => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    let mostUsedCategory = 'None';
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedCategory = cat;
      }
    });

    // Average daily spending (this month)
    const averageDailySpending = thisMonthSpent / Math.max(1, currentDay);

    // Calculate a quick health score
    let healthScore = 100;
    if (budgets.length === 0) {
      healthScore = 85; // Default when no budgets are set
    } else {
      let exceededCount = 0;
      let totalBudgetLimit = 0;

      budgets.forEach(b => {
        totalBudgetLimit += b.limit;
        const catSpent = thisMonthExpenses
          .filter(e => e.category === b.category)
          .reduce((sum, e) => sum + e.amount, 0);
        
        if (catSpent > b.limit) {
          exceededCount++;
          const ratio = catSpent / b.limit;
          healthScore -= Math.min(25, Math.floor((ratio - 1) * 20) + 10);
        } else if (catSpent > b.limit * 0.7) {
          healthScore -= 5;
        }
      });

      if (thisMonthSpent > totalBudgetLimit && totalBudgetLimit > 0) {
        healthScore -= 15;
      }

      healthScore = Math.max(0, Math.min(100, healthScore));
    }

    res.json({
      totalSpent,
      thisMonthSpent,
      highestExpense,
      totalTransactions,
      mostUsedCategory,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      healthScore
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// GET /api/insights - Smart AI Financial Insights
router.get('/insights', (req, res) => {
  try {
    const expenses = getExpenses();
    const budgets = getBudgets();
    const { todayStr, currentMonthStr, currentDay } = getLocalDateInfo();

    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
    const thisMonthSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // 1. Spending Analysis
    const spendingAnalysis = [];
    if (thisMonthSpent > 0) {
      const categoryTotals = {};
      thisMonthExpenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });

      // Sort categories by spending descending
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

      if (sortedCategories.length > 0) {
        const [topCat, topAmt] = sortedCategories[0];
        const pct = Math.round((topAmt / thisMonthSpent) * 100);
        spendingAnalysis.push(`You spent ${pct}% of this month's total spending on ${topCat} (₹${topAmt}).`);
        
        if (sortedCategories.length > 1) {
          const [secCat, secAmt] = sortedCategories[1];
          const secPct = Math.round((secAmt / thisMonthSpent) * 100);
          spendingAnalysis.push(`${secCat} is your second highest spending category at ${secPct}% (₹${secAmt}).`);
        }
      }
    } else {
      spendingAnalysis.push('No expenses recorded this month yet. Add expenses to generate a spending breakdown!');
    }

    // 2. Financial Health Score Calculation
    let healthScore = 100;
    let scoreDetails = 'Excellent budget compliance!';
    if (budgets.length === 0) {
      healthScore = 85;
      scoreDetails = 'Set category budgets on the Budgets page to get an accurate financial health score.';
    } else {
      let exceededCount = 0;
      let totalBudgetLimit = 0;

      budgets.forEach(b => {
        totalBudgetLimit += b.limit;
        const catSpent = thisMonthExpenses
          .filter(e => e.category === b.category)
          .reduce((sum, e) => sum + e.amount, 0);
        
        if (catSpent > b.limit) {
          exceededCount++;
          const ratio = catSpent / b.limit;
          healthScore -= Math.min(25, Math.floor((ratio - 1) * 20) + 10);
        } else if (catSpent > b.limit * 0.7) {
          healthScore -= 5;
        }
      });

      if (thisMonthSpent > totalBudgetLimit && totalBudgetLimit > 0) {
        healthScore -= 15;
      }

      healthScore = Math.max(0, Math.min(100, healthScore));

      if (healthScore >= 90) {
        scoreDetails = 'Outstanding! You are managing your budgets perfectly this month.';
      } else if (healthScore >= 70) {
        scoreDetails = 'Good job, but you are approaching your budget limits in some categories.';
      } else if (healthScore >= 50) {
        scoreDetails = 'Warning: Multiple budgets exceeded. Review your spending list to curb extra costs.';
      } else {
        scoreDetails = 'Critical: You have significantly exceeded your budget limits. High risk of overspending.';
      }
    }

    // 3. Money Saving Tips
    const moneySavingTips = [];
    if (thisMonthSpent > 0) {
      // Find top spending category
      const categoryTotals = {};
      thisMonthExpenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });
      const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      
      if (sorted.length > 0) {
        const [topCat, topAmt] = sorted[0];
        const potentialSavings = Math.round(topAmt * 0.15); // 15% savings
        moneySavingTips.push(`Reducing ${topCat} expenses by 15% could save approximately ₹${potentialSavings} this month.`);
      }

      // Add general smart tip
      const dailyAverage = thisMonthSpent / currentDay;
      if (dailyAverage > 500) {
        const targetSavings = Math.round(dailyAverage * 0.1 * 30);
        moneySavingTips.push(`Capping miscellaneous expenses by ₹${Math.round(dailyAverage * 0.1)}/day will save you ₹${targetSavings}/month.`);
      } else {
        moneySavingTips.push(`Setting aside ₹50/day into a compound savings account will accumulate ₹1,500 by the end of the month.`);
      }
    } else {
      moneySavingTips.push('Add expenses to see tailored daily saving tips.');
      moneySavingTips.push('Track regular expenses to see where small changes yield big returns.');
    }

    // 4. Budget Recommendations
    // Base recommendation on average monthly spending in each category across all historical data
    const budgetRecommendations = [];
    const monthlySpendingByCat = {}; // {category: { month: total }}
    
    expenses.forEach(e => {
      const month = e.date.substring(0, 7); // YYYY-MM
      if (!monthlySpendingByCat[e.category]) {
        monthlySpendingByCat[e.category] = {};
      }
      monthlySpendingByCat[e.category][month] = (monthlySpendingByCat[e.category][month] || 0) + e.amount;
    });

    Object.entries(monthlySpendingByCat).forEach(([cat, months]) => {
      const totals = Object.values(months);
      const avg = totals.reduce((sum, val) => sum + val, 0) / totals.length;
      // Recommended is avg * 1.15 rounded to nearest 500
      const recommendedLimit = Math.max(1000, Math.round((avg * 1.15) / 500) * 500);
      budgetRecommendations.push({
        category: cat,
        recommendedLimit,
        reason: `Based on your historical average monthly spending of ₹${Math.round(avg)} in ${cat}.`
      });
    });

    // Fallback if no categories have expenses
    if (budgetRecommendations.length === 0) {
      const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'];
      CATEGORIES.forEach(cat => {
        budgetRecommendations.push({
          category: cat,
          recommendedLimit: cat === 'Bills' ? 10000 : cat === 'Food' ? 5000 : 2000,
          reason: 'Initial standard recommendation.'
        });
      });
    }

    // 5. Smart Alerts
    const smartAlerts = [];
    
    // Check exceeded budgets
    budgets.forEach(b => {
      const catSpent = thisMonthExpenses
        .filter(e => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0);

      if (catSpent > b.limit) {
        const pctOver = Math.round(((catSpent - b.limit) / b.limit) * 100);
        smartAlerts.push({
          type: 'warning',
          category: b.category,
          message: `${b.category} budget exceeded by ${pctOver}% (spent ₹${catSpent} of ₹${b.limit} limit).`
        });
      } else if (catSpent > b.limit * 0.85) {
        const pctSpent = Math.round((catSpent / b.limit) * 100);
        smartAlerts.push({
          type: 'info',
          category: b.category,
          message: `${b.category} spending is at ${pctSpent}% of its budget limit (₹${catSpent} of ₹${b.limit}).`
        });
      }
    });

    // Check MoM spending increase (this month vs last month)
    // Find last month YYYY-MM
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth(); // 0-indexed, so current month is month (e.g. 5 for June)
    if (month === 0) {
      month = 12;
      year = year - 1;
    }
    const lastMonthStr = `${year}-${String(month).padStart(2, '0')}`;

    const lastMonthExpenses = expenses.filter(e => e.date.startsWith(lastMonthStr));

    // Get unique categories present in both months
    const allCategories = new Set([
      ...thisMonthExpenses.map(e => e.category),
      ...lastMonthExpenses.map(e => e.category)
    ]);

    allCategories.forEach(cat => {
      const curSpent = thisMonthExpenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      const prevSpent = lastMonthExpenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);

      if (prevSpent > 0 && curSpent > prevSpent * 1.1) {
        const pctIncrease = Math.round(((curSpent - prevSpent) / prevSpent) * 100);
        smartAlerts.push({
          type: 'trend_increase',
          category: cat,
          message: `${cat} spending increased by ${pctIncrease}% compared to last month (₹${curSpent} vs ₹${prevSpent}).`
        });
      }
    });

    // Alert for single large transaction (> 30% of this month's total spending)
    if (thisMonthSpent > 0) {
      thisMonthExpenses.forEach(e => {
        if (e.amount > thisMonthSpent * 0.3 && e.amount > 1000) {
          smartAlerts.push({
            type: 'large_transaction',
            category: e.category,
            message: `Single large transaction of ₹${e.amount} in ${e.category} on ${e.date} (${e.note || 'No note'}).`
          });
        }
      });
    }

    res.json({
      healthScore,
      scoreDetails,
      spendingAnalysis,
      moneySavingTips,
      budgetRecommendations,
      smartAlerts
    });
  } catch (error) {
    console.error('Error generating AI Insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;
