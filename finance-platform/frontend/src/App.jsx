import React, { useEffect, useState } from "react";

import { createExpense, getExpenses, login, register } from "./api";

const initialExpense = {
  amount: "",
  currency: "USD",
  category: "",
  merchant: "",
  expense_date: "",
  note: "",
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", full_name: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [expenseForm, setExpenseForm] = useState(initialExpense);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchExpenses();
  }, [token]);

  async function fetchExpenses() {
    try {
      const data = await getExpenses(token);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await register(registerForm);
      setMessage("Registration successful. Please login.");
      setRegisterForm({ email: "", password: "", full_name: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function onLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await login(loginForm);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setMessage("Login successful.");
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function onCreateExpense(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await createExpense(token, {
        ...expenseForm,
        amount: Number(expenseForm.amount),
      });
      setExpenseForm(initialExpense);
      setMessage("Expense created.");
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setExpenses([]);
    setMessage("Logged out.");
    setError("");
  }

  return (
    <div className="container">
      <h1>Finance Platform</h1>
      <p>React UI for auth and expense tracking.</p>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        <div className="card">
          <h3>Register</h3>
          <form onSubmit={onRegister}>
            <label>Email</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <label>Full Name</label>
            <input
              value={registerForm.full_name}
              onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>

        <div className="card">
          <h3>Login</h3>
          <form onSubmit={onLogin}>
            <label>Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={logout} style={{ marginLeft: 8, background: "#334155" }}>
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Create Expense</h3>
        <form onSubmit={onCreateExpense}>
          <div className="grid">
            <div>
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Currency</label>
              <input
                value={expenseForm.currency}
                onChange={(e) => setExpenseForm({ ...expenseForm, currency: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <input
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Merchant</label>
              <input
                value={expenseForm.merchant}
                onChange={(e) => setExpenseForm({ ...expenseForm, merchant: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Expense Date</label>
              <input
                type="date"
                value={expenseForm.expense_date}
                onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Note</label>
              <input
                value={expenseForm.note}
                onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" disabled={!token}>Create Expense</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Expenses</h3>
        {!token && <p>Login to load expenses.</p>}
        {token && expenses.length === 0 && <p>No expenses found.</p>}
        {expenses.map((item) => (
          <div key={item.id} className="expense-item">
            <strong>{item.merchant}</strong> - {item.category}<br />
            {item.amount} {item.currency} on {item.expense_date}
            {item.note ? <div>Note: {item.note}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
