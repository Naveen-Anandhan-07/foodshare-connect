import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
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
  fssaiNumber: "",
};

function DonorRegister() {
  const [formData, setFormData] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response =
        await registerDonor(formData);

      toast.success(response.data.message);

      navigate("/donor/login");
    } catch (error) {
      let message = "Registration failed";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Donor Registration</h2>

        <p className="auth-subtitle">
          Register and wait for manual FSSAI
          verification.
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
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>FSSAI Licence Number</label>

            <input
              type="text"
              className="form-control"
              name="fssaiNumber"
              value={formData.fssaiNumber}
              onChange={handleChange}
              pattern="[0-9]{14}"
              maxLength="14"
              placeholder="Enter 14-digit FSSAI number"
              required
            />
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

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Registration"}
          </button>
        </form>

        <p className="auth-helper-text">
          Already registered?{" "}
          <Link to="/donor/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DonorRegister;
