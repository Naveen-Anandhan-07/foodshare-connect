import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginReceiver } from "../services/api";

function ReceiverLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginReceiver(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "receiver");
      localStorage.setItem("name", data.name);
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/receiver/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Receiver Login</h2>
        <p className="auth-subtitle">Log in to browse and request available food.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in..." : "Login as Receiver"}
          </button>
        </form>

        <p className="auth-helper-text">
          New receiver? <Link to="/receiver/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default ReceiverLogin;
