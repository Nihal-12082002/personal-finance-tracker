import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Overall totals
  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const spentPercent = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>

      {/* ==== Alerts Section ==== */}
      {totalExpense > totalBudget && (
        <div className="alert alert-danger">
          ⚠️ You have overspent! Expenses (₹{totalExpense}) exceeded Budget (₹{totalBudget})
        </div>
      )}

      {totalExpense > totalBudget * 0.8 && totalExpense <= totalBudget && (
        <div className="alert alert-warning">
          ⚠️ Warning: You’ve already used {spentPercent}% of your budget.
        </div>
      )}

      {totalExpense <= totalBudget * 0.5 && totalBudget > 0 && (
        <div className="alert alert-success">
          ✅ Great! You’re spending wisely. Only ₹{totalExpense} out of ₹{totalBudget} used.
        </div>
      )}

      {/* ==== Overall Summary Card ==== */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Total Budget: ₹{totalBudget}</h5>
        <h5>Total Expenses: ₹{totalExpense}</h5>
        <div className="progress mt-3" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${
              spentPercent > 100 ? "bg-danger" : spentPercent > 80 ? "bg-warning" : "bg-success"
            }`}
            role="progressbar"
            style={{ width: `${spentPercent > 100 ? 100 : spentPercent}%` }}
            aria-valuenow={spentPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {spentPercent > 100 ? "Over 100%" : `${spentPercent}%`}
          </div>
        </div>
      </div>

      {/* ==== Existing Budgets Section ==== */}
      <h4>Budgets</h4>
      <ul className="list-group mb-4">
        {budgets.map((budget) => (
          <li key={budget.id} className="list-group-item d-flex justify-content-between align-items-center">
            {budget.name} - ₹{budget.amount}
            <span className="badge bg-primary">From {budget.start_date} to {budget.end_date}</span>
          </li>
        ))}
      </ul>

      {/* ==== Existing Categories Section ==== */}
      <h4>Categories</h4>
      <ul className="list-group mb-4">
        {categories.map((cat) => (
          <li key={cat.id} className="list-group-item">
            {cat.name}
          </li>
        ))}
      </ul>

      {/* ==== Existing Expenses Section ==== */}
      <h4>Expenses</h4>
      <ul className="list-group mb-4">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
            {expense.title || "Expense"} - ₹{expense.amount}
            <span className="badge bg-secondary">{expense.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
