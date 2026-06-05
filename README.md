<div align="center">

# 💰 SpendWise

### Smart Expense Tracker 

A modern full-stack expense management application built as a solution for **Studio Graphene's Full Stack Developer Assessment (Exercise 2: Mini Expense Tracker)**.

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express-black?style=flat-square&logo=express&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)]()
[![Material UI](https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white)]()

</div>

---

## 📖 Project Overview

SpendWise is a modern full-stack expense management application designed to help users track daily spending, monitor budgets, and gain meaningful insights into their financial habits. The application provides an intuitive dashboard for managing expenses, visualizing spending patterns through interactive charts, exporting transaction records, and receiving smart spending recommendations. Built using React, Node.js, and Express, the project demonstrates end-to-end full-stack development, REST API design, data persistence, and responsive UI implementation.


## 🌐 Live Demo

**Live Link:** https://spend-wise-livid.vercel.app/

**Backend API:** https://spendwise-m7ol.onrender.com

# 💻 Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React.js (Vite) | Building a fast and responsive user interface |
| Material UI | Modern UI components and responsive layouts |
| React Router DOM | Client-side routing |
| Axios | API communication |
| Recharts | Data visualization and analytics |
| Framer Motion | Smooth animations and transitions |
| React Hot Toast | User notifications and alerts |

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | JavaScript runtime |
| Express.js | REST API development |

## Storage

| Technology | Purpose |
|------------|----------|
| JSON Files | Lightweight persistent storage for expenses and budgets |

**Why This Stack?**

The selected stack provides a lightweight yet scalable architecture suitable for demonstrating full-stack development skills. React enables efficient UI development, Express provides a clean API layer, and JSON persistence keeps the application simple while meeting project requirements.

# ✨ Features <br>
**Expense Management**  <br>
- Add new expenses   
- Edit existing expenses     
- Delete expenses
- View all expenses sorted by date  
- Form validation for all inputs 

**Filtering & Search**
- Filter by category 
- Filter by date range  
- Search by notes and categories  

**Analytics Dashboard**
- Total spending overview
- Monthly spending summary
- Highest expense tracking
- Category-wise expense breakdown
- Average spending metrics

**Budget Tracking**
- Set category-wise budgets
- Monitor budget utilization
- Visual budget progress indicators
- Overspending warnings
  
**Smart Insights**
- Spending analysis
- Budget recommendations
- Financial health score
- Smart alerts based on spending patterns
  
**Additional Features**
- CSV Export
- Light/Dark Mode
- Responsive Design
- Interactive Charts
- Toast Notifications

# 🚀 How to Run Locally  <br>

**Prerequisites**   <br>

Node.js (v16 or higher)  <br>
npm

**Clone Repository**   <br>

git clone https://github.com/TiyaRajput123/SpendWise.git    <br>
cd SpendWise

**Install Dependencies**

npm install  <br>
cd frontend && npm install  <br>
cd ../backend && npm install  <br>

**Start Backend**

cd backend       <br>
npm start

Backend runs on:
http://localhost:5000

**Start Frontend**

Open a new terminal:    <br>
cd frontend     <br>
npm run dev

Frontend runs on:
http://localhost:5173

# 📡 API Documentation <br>

**Expenses**     <br>
**Get All Expenses**     <br>

GET /api/expenses    <br>

Response:            <br>
[
  {
    "id": 1,
    "amount": 250,
    "category": "Food",
    "date": "2026-06-01",
    "note": "Lunch"
  }
]

**Get Expense By ID**      <br>

GET /api/expenses/:id       <br>

Response:                      <br>

{
  "id": 1,
  "amount": 250,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Lunch"
}

**Create Expense**              <br>

POST /api/expenses

Request Body:        <br>
{
  "amount": 250,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Lunch"
}
 <br>
Response:               <br>
{
  "message": "Expense created successfully"
}

**Update Expense**                  <br>

PUT /api/expenses/:id    <br>
 
Request Body:
{
  "amount": 300,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Updated Lunch"
}
 <br>
Response:
{
  "message": "Expense updated successfully"
}
 
**Delete Expense**               <br>

DELETE /api/expenses/:id
 <br>
Response:
{
  "message": "Expense deleted successfully"
}

 **Summary**                  <br>

**Get Dashboard Summary**   <br>   
GET /api/summary
 <br>
Response:
{
  "totalSpent": 12500,
  "highestExpense": 2500,
  "totalTransactions": 40,
  "financialHealthScore": 82
}

 **Insights**      <br>

**Get Financial Insights**
GET /api/insights    <br>  
Response:

{
  "healthScore": 82,
  "recommendations": [
    "Reduce food spending by ₹100/day"
  ]
}

**Budgets**
<br>
**Get Budgets**     <br>
GET /api/budgets

**Create Budget**      <br>
POST /api/budgets

Request Body:

{
  "category": "Food",
  "budget": 5000
}

**Update Budget**     <br>
PUT /api/budgets/:id

Request Body:

{
  "budget": 6000
}

---

# 📂 Project Structure

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
## 🔮Next Steps

Given additional development time, the following improvements would be implemented:

- User Authentication & Authorization
- MongoDB/PostgreSQL Integration
- Recurring Expense Management
- Multi-user Support
- AI-Powered Insights using LLM APIs
- Unit and Integration Testing
- PWA Support
- Email Reports & Notifications
- Expense Receipt Uploads

---


