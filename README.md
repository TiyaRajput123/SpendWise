# SpendWise 

SpendWise is a modern full-stack expense management application designed to help users track daily spending, monitor budgets, and gain meaningful insights into their financial habits. The application provides an intuitive dashboard for managing expenses, visualizing spending patterns through interactive charts, exporting transaction records, and receiving smart spending recommendations. Built using React, Node.js, and Express, the project demonstrates end-to-end full-stack development, REST API design, data persistence, and responsive UI implementation.

## Live Demo : https://spend-wise-livid.vercel.app/

## Tech Stack
**Frontend**
Technology	                                   #   Purpose
React.js (Vite)	          #   Building a fast and responsive user interface
Material UI	                Modern UI components and responsive layouts
React Router DOM	          Client-side routing
Axios	                      API communication
Recharts	                  Data visualization and analytics
Framer Motion               Smooth animations and transitions
React Hot Toast	            User notifications and alerts
Backend
Technology	Purpose
Node.js	JavaScript runtime
Express.js	REST API development
Storage
Technology	Purpose
JSON Files	Lightweight persistent storage for expenses and budgets
Why This Stack?

The selected stack provides a lightweight yet scalable architecture suitable for demonstrating full-stack development skills. React enables efficient UI development, Express provides a clean API layer, and JSON persistence keeps the application simple while meeting project requirements.

Features
Expense Management
Add new expenses
Edit existing expenses
Delete expenses
View all expenses sorted by date
Form validation for all inputs
Filtering & Search
Filter by category
Filter by date range
Search by notes and categories
Analytics Dashboard
Total spending overview
Monthly spending summary
Highest expense tracking
Category-wise expense breakdown
Average spending metrics
Budget Tracking
Set category-wise budgets
Monitor budget utilization
Visual budget progress indicators
Overspending warnings
Smart Insights
Spending analysis
Budget recommendations
Financial health score
Smart alerts based on spending patterns
Additional Features
CSV Export
Light/Dark Mode
Responsive Design
Interactive Charts
Toast Notifications
How to Run Locally
Prerequisites
Node.js (v16 or higher)
npm
Clone Repository
git clone https://github.com/TiyaRajput123/SpendWise.git
cd SpendWise
Install Dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
Start Backend
cd backend
npm start

Backend runs on:

http://localhost:5000
Start Frontend

Open a new terminal:

cd frontend
npm run dev

Frontend runs on:

http://localhost:5173
API Documentation
Expenses
Get All Expenses
GET /api/expenses

Response:

[
  {
    "id": 1,
    "amount": 250,
    "category": "Food",
    "date": "2026-06-01",
    "note": "Lunch"
  }
]
Get Expense By ID
GET /api/expenses/:id

Response:

{
  "id": 1,
  "amount": 250,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Lunch"
}
Create Expense
POST /api/expenses

Request Body:

{
  "amount": 250,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Lunch"
}

Response:

{
  "message": "Expense created successfully"
}
Update Expense
PUT /api/expenses/:id

Request Body:

{
  "amount": 300,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Updated Lunch"
}

Response:

{
  "message": "Expense updated successfully"
}
Delete Expense
DELETE /api/expenses/:id

Response:

{
  "message": "Expense deleted successfully"
}
Summary
Get Dashboard Summary
GET /api/summary

Response:

{
  "totalSpent": 12500,
  "highestExpense": 2500,
  "totalTransactions": 40,
  "financialHealthScore": 82
}
Insights
Get Financial Insights
GET /api/insights

Response:

{
  "healthScore": 82,
  "recommendations": [
    "Reduce food spending by ₹100/day"
  ]
}
Budgets
Get Budgets
GET /api/budgets
Create Budget
POST /api/budgets

Request Body:

{
  "category": "Food",
  "budget": 5000
}
Update Budget
PUT /api/budgets/:id

Request Body:

{
  "budget": 6000
}
---

## Folder Structure

```
SpendWise/
├── backend/
│   ├── data/               # Persistent JSON databases
│   ├── routes/             # Express routing split by concerns
│   ├── utils/              # Local utilities (safely read/write database)
│   ├── server.js           # Server setup and port binding (port 5000)
│   └── package.json        
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components (tables, modals, navigation)
│   │   ├── pages/          # Core pages (Dashboard, Expenses, Budgets, Insights)
│   │   ├── services/       # Axios API integration
│   │   ├── theme/          # Custom Material UI light & dark theme settings
│   │   ├── utils/          # CSV parser and file builders
│   │   ├── App.jsx         
│   │   ├── main.jsx        
│   │   └── index.css       
│   ├── index.html          
│   └── package.json        
├── package.json            # Concurrently execution scripts for monorepo
└── README.md               # Main instructions
```
Next Steps

Given additional development time, the following improvements would be implemented:

User Authentication & Authorization
MongoDB/PostgreSQL Integration
Recurring Expense Management
Multi-user Support
Advanced Financial Forecasting
AI-Powered Insights using LLM APIs
Unit and Integration Testing
PWA Support
Email Reports & Notifications
Expense Receipt Uploads
---

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Setup & Installation

If not already installed, run the installation script from the root workspace directory:

```bash
npm run install-all
```

This installs packages in the root, `backend/`, and `frontend/` folders.

### Run in Development

To start both the Express backend API and Vite React frontend concurrently in development mode, run:

```bash
npm run dev
```

- **Frontend client**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## Key Features

1. **Dashboard**: High-level KPI summary statistics, categories distribution pie chart, monthly trends bar chart, AI Insights preview, and recent transactions.
2. **Expenses Log**: Add, edit, delete, and view expense detail items. Validates input values (no negative amounts, category is required, no future dates relative to local time). Filters by category and date ranges (including custom date range selectors).
3. **Budgeting Board**: Configure monthly expense limits per category. Renders real-time visual progress indicators that shift colors (Green under 70%, Amber 70-90%, and Red over 90%) and prompt warnings.
4. **Smart AI Insights**: Programmatic financial health index evaluator, daily saving tips based on top categories, smart alerts for MoM trend spikes, large transactions, and exceeded budgets.
5. **CSV Exporter**: Downloads the currently filtered transactions into `expenses.csv`.
6. **Premium Design Language**: Custom theme containing a standard Light Mode and an elegant Dark Mode (using premium slate colors). High-quality typography using *Plus Jakarta Sans*, sleek shadows, hover translations, and soft animations.
