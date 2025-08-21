import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AppNavbar from "./components/NavBar";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Categories from "./pages/Categories";  
import Expenses from "./pages/Expenses"; 
import Income from "./pages/Income";
import Reports from "./pages/Reports";  

const TOKEN_KEY = "token";

function ProtectedRoute({ element }) {
  const authed = !!localStorage.getItem(TOKEN_KEY);
  return authed ? element : <Navigate to="/login" replace />;
}

function AppShell() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <AppNavbar />}

      <div className="container-fluid mt-4">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/budgets"   element={<ProtectedRoute element={<Budgets />} />} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/expenses"  element={<ProtectedRoute element={<Expenses />} />} />
          <Route path="/income"    element={<ProtectedRoute element={<Income />} />} />
          <Route path="/reports"   element={<ProtectedRoute element={<Reports />} />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
