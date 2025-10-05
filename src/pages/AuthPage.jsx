import { useState } from "react";
import API from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === "login" ? "auth/login" : "auth/register";
      const { data } = await API.post(endpoint, form);
      if (mode === "login") {
        localStorage.setItem("token", data.token);
        onAuthSuccess();
      } else {
        setMsg("Registered successfully, now login!");
        setMode("login");
      }
    } catch (err) {
      setMsg(err.response?.data?.error?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>

      <p>{msg}</p>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </div>
  );
}
