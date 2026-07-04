import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDonationById, updateDonation } from "../services/api";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

const statuses = ["Available", "Requested", "Completed", "Expired"];

const toDatetimeLocal = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const EditDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data } = await getDonationById(id);
        setFormData({
          foodName: data.foodName,
          foodType: data.foodType,
          quantity: data.quantity,
          pickupLocation: data.pickupLocation,
          city: data.city,
          expiryTime: toDatetimeLocal(data.expiryTime),
          description: data.description || "",
          status: data.status,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load donation");
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDonation(id, formData);
      toast.success("Donation updated successfully!");
      navigate("/donor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update donation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading donation...</div>;
  if (error) return <div className="error-state container mt-3">{error}</div>;
  if (!formData) return null;

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h2>Edit Food Donation</h2>
        <p className="auth-subtitle">Update details or change the donation status.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              className="form-control"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
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

          <div className="form-row">
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
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDonation;
