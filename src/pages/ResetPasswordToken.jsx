import React  from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordToken() {
  const { token } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL;

  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${baseUrl}/reset-password/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setValid(true);
        } else {
          setError(data.error || "Token invalid or expired.");
        }
      } catch (err) {
        setError("Server error while verifying token.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await fetch(`${baseUrl}/reset-password/new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        navigate("/recruiter/login"); // go back to login page
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  if (loading) return <p>Verifying token...</p>;

  return (
    <div className="auth-card space-y-4 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>

      {!valid ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input w-full"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
