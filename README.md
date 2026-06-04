# SpendWise 

SpendWise is a modern full-stack expense management application designed to help users track daily spending, monitor budgets, and gain meaningful insights into their financial habits. The application provides an intuitive dashboard for managing expenses, visualizing spending patterns through interactive charts, exporting transaction records, and receiving smart spending recommendations. Built using React, Node.js, and Express, the project demonstrates end-to-end full-stack development, REST API design, data persistence, and responsive UI implementation.

## Live Demo : https://spend-wise-livid.vercel.app/

## Tech Stack
**Frontend**
Technology	                                     Purpose
React.js (Vite)	            Building a fast and responsive user interface
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
Tech Stack
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
