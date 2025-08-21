import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#845EC2"];

const Report = () => {
  const [trends, setTrends] = useState([]);
  const [monthly, setMonthly] = useState(null);
  const [categoryWise, setCategoryWise] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // current month
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReports();
  }, [month, year]);

  const fetchReports = async () => {
    try {
      const trendRes = await axios.get("http://localhost:8000/api/reports/trends", {
        withCredentials: true,
      });
      setTrends(trendRes.data);

      const monthlyRes = await axios.get(`http://localhost:8000/api/reports/monthly/${month}/${year}`, {
        withCredentials: true,
      });
      setMonthly(monthlyRes.data);

      const catRes = await axios.get(`http://localhost:8000/api/reports/category-wise/${month}/${year}`, {
        withCredentials: true,
      });
      setCategoryWise(catRes.data);

    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reports & Analytics</h2>

      {/* Filters */}
      <div className="mb-4 d-flex gap-3">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025, 2026].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      {/* Monthly Summary */}
      {monthly && (
        <div className="mb-5">
          <h4>Summary ({month}/{year})</h4>
          <p>Total Income: ₹{monthly.total_income}</p>
          <p>Total Expense: ₹{monthly.total_expense}</p>
          <p>Net Savings: ₹{monthly.total_income - monthly.total_expense}</p>
        </div>
      )}

      {/* Trends Line Chart */}
      <div className="mb-5">
        <h4>Income vs Expenses (Trends)</h4>
        <LineChart width={600} height={300} data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#0088FE" />
          <Line type="monotone" dataKey="expense" stroke="#FF8042" />
        </LineChart>
      </div>

      {/* Bar Chart */}
      <div className="mb-5">
        <h4>Income vs Expenses (Bar View)</h4>
        <BarChart width={600} height={300} data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#0088FE" />
          <Bar dataKey="expense" fill="#FF8042" />
        </BarChart>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4>Category-wise Expenses ({month}/{year})</h4>
        <PieChart width={400} height={300}>
          <Pie
            data={categoryWise.map((c) => ({
              name: c.category?.name || "Uncategorized",
              value: c.total,
            }))}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryWise.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Report;
