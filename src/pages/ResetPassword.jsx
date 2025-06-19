import React  from "react";
import { useState } from "react";
import "../common/styles/App.css";

export default function ResetPassword() {
  console.log("ResetPassword page rendered");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const baseUrl = import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/reset-password/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) setSent(true);
    else alert(data.error);
  };

  return (
    <div className="login-card" style={{ maxWidth: 480, margin: "60px auto" }}>
      <h2 style={{ marginBottom: 20 }}>Forgot your password?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Send Reset Link</button>
      </form>
      {sent && <p className="status-msg">If your email is a registered account, you 
        will receive an email password reset link.  
        Please check your email for the reset link.</p>}
    </div>
  );
}
