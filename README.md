# SpendWise - Premium SaaS Financial Dashboard

SpendWise is a premium-quality, full-stack financial dashboard designed to feel like a modern SaaS platform (reminiscent of Linear, Stripe, and Vercel). It allows users to track expenses, set budgets, view visual progress indicators, export transaction reports, and generate intelligent financial health scores and saving alerts.

## Tech Stack

- **Frontend**: React.js (Vite), Material UI (MUI v5), Axios, React Router (v6), Recharts, React Hot Toast, Framer Motion
- **Backend**: Node.js, Express.js
- **Storage**: JSON File Persistence (`expenses.json` and `budgets.json`)

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
