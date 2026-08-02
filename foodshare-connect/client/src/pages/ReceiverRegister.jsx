import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerReceiver } from "../services/api";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  organizationName: "",
  receiverType: "NGO",
  address: "",
  city: "",
};

function ReceiverRegister() {
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
      const { data } = await registerReceiver(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "receiver");
      localStorage.setItem("name", data.name);
      toast.success("Registration successful! Welcome to FoodShare Connect.");
      navigate("/receiver/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Receiver Registration</h2>
        <p className="auth-subtitle">
          Find and request surplus food for your community.
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
              <label>Organization / NGO Name</label>
              <input
                className="form-control"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Receiver Type</label>
            <select
              className="form-control"
              name="receiverType"
              value={formData.receiverType}
              onChange={handleChange}
            >
              <option value="NGO">NGO</option>
              <option value="Shelter">Shelter</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Individual">Individual</option>
            </select>
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
            {loading ? "Registering..." : "Register as Receiver"}
          </button>
        </form>

        <p className="auth-helper-text">
          Already have an account? <Link to="/receiver/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default ReceiverRegister;
