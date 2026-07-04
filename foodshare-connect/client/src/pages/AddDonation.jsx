import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createDonation } from "../services/api";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

const initialState = {
  foodName: "",
  foodType: "Cooked Food",
  quantity: "",
  pickupLocation: "",
  city: "",
  expiryTime: "",
  description: "",
};

const AddDonation = () => {
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
      await createDonation(formData);
      toast.success("Food donation posted successfully!");
      navigate("/donor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h2>Add Food Donation</h2>
        <p className="auth-subtitle">Share details about your surplus food.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              className="form-control"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="e.g. Vegetable Biryani"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Food Type</label>
              <select
                className="form-control"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
              >
                {foodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. Serves 20 people"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pickup Location</label>
              <input
                className="form-control"
                name="pickupLocation"
                value={formData.pickupLocation}
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
          </div>

          <div className="form-group">
            <label>Expiry Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any extra details receivers should know"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Posting..." : "Post Donation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDonation;
