const fs = require('fs');
const path = require('path');

const EXPENSES_FILE = path.join(__dirname, '..', 'data', 'expenses.json');
const BUDGETS_FILE = path.join(__dirname, '..', 'data', 'budgets.json');

// Ensure data folder and files exist
const initDB = () => {
  const dir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(EXPENSES_FILE)) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(BUDGETS_FILE)) {
    fs.writeFileSync(BUDGETS_FILE, JSON.stringify([], null, 2));
  }
};

const readData = (filePath) => {
  try {
    initDB();
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database file: ${filePath}`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    initDB();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing database file: ${filePath}`, error);
    return false;
  }
};

const getExpenses = () => readData(EXPENSES_FILE);
const saveExpenses = (expenses) => writeData(EXPENSES_FILE, expenses);

const getBudgets = () => readData(BUDGETS_FILE);
const saveBudgets = (budgets) => writeData(BUDGETS_FILE, budgets);

module.exports = {
  getExpenses,
  saveExpenses,
  getBudgets,
  saveBudgets,
  initDB
};
