import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!identifier.trim() || !password) {
      alert("Please enter your username/email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        identifier,
        password
      });

      if (!result.success) {
        alert(result.message || "Login failed. Please try again.");
        return;
      }

      const destination = location.state?.from || "/";

      alert(`Welcome back, ${result.user.username}!`);
      navigate(destination, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">👋</div>
        <p className="auth-eyebrow">WELCOME BACK</p>
        <h1>Login to Wanderlah</h1>
        <p className="auth-description">
          Sign in to continue with your travel plans and bookings.
        </p>

        <form onSubmit={handleLogin}>
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New to Wanderlah? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;