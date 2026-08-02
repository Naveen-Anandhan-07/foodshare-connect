import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginDonor } from "../services/api";

function DonorLogin() {
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
      const { data } = await loginDonor(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "donor");
      localStorage.setItem("name", data.name);
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/donor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Donor Login</h2>
        <p className="auth-subtitle">Log in to manage your food donations.</p>

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
            {loading ? "Logging in..." : "Login as Donor"}
          </button>
        </form>

        <p className="auth-helper-text">
          New donor? <Link to="/donor/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default DonorLogin;
