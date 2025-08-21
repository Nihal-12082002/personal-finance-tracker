import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", month: "", year: "" });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save new / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8000/api/budgets/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/budgets", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: "", amount: "", month: "", year: "" });
      setEditing(null);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const handleEdit = (budget) => {
    setForm(budget);
    setEditing(budget.id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>💰 Budgets</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={form.start_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="end_date"
              placeholder="End Date"
              value={form.end_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Update Budget" : "Add Budget"}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.length > 0 ? (
            budgets.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.amount}</td>
                <td>{b.start_date}</td>
                <td>{b.end_date}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No Budgets Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
