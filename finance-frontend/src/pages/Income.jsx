import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", description: "", date: "", category_id: "" });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch incomes
  const fetchIncome = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/incomes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncome(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch categories (income only)
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.filter((c) => c.type === "income"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncome();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8000/api/incomes/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/incomes", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({title: "", amount: "", description: "", date: "", category_id: "" });
      setEditing(null);
      fetchIncome();
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
      await axios.delete(`http://127.0.0.1:8000/api/incomes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIncome();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2>💰 Income</h2>

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
          {/* <div className="col-md-3">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
            />
          </div> */}
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

          <div className="col-md-2">
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
            <button type="submit" className="btn btn-success w-100">
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
            <th>Title</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {income.length > 0 ? (
            income.map((i) => (
              <tr key={i.id}>
                <td>₹{i.amount}</td>
                <td>{i.title}</td>
                <td>{i.date}</td>
                <td>{i.category?.name}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(i)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No Income Records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
