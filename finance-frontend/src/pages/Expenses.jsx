import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ amount: "", description: "", date: "", category_id: "",});
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch categories (expenses only)
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.filter((c) => c.type === "expense"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8000/api/expenses/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/expenses", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ amount: "", description: "", date: "", category_id: "" });
      setEditing(null);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditing(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>💸 Expenses</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
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

           
          
          <div className="col-md-3">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-danger w-100">
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((e) => (
              <tr key={e.id}>
                <td>₹{e.amount}</td>
                <td>{e.description}</td>
                <td>{e.date}</td>
                <td>{e.category?.name}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(e)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No Expenses Records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
