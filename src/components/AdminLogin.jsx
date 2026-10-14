
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/api";
import "./Admin.css";
function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await adminLogin({ username, password });

      if (!data.token) {
        throw new Error("The server did not return a login token.");
      }

      localStorage.setItem("wanderlahAdminToken", data.token);

      console.log("[ADMIN] Login successful");
      navigate("/admin");
    } catch (err) {
      console.error("[ADMIN] Login failed:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Admin login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <h1>Admin Login</h1>
      <p>Sign in to manage TourBooking.</p>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
