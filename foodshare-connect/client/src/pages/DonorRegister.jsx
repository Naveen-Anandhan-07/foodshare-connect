import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerDonor } from "../services/api";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  organizationName: "",
  address: "",
  city: "",
};

const DonorRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerDonor(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "donor");
      localStorage.setItem("name", data.name);
      toast.success("Registration successful! Welcome to FoodShare Connect.");
      navigate("/donor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Donor Registration</h2>
        <p className="auth-subtitle">
          Share your surplus food and help reduce waste in your community.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
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
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                className="form-control"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Restaurant, hostel, home, etc."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Registering..." : "Register as Donor"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/donor/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default DonorRegister;
