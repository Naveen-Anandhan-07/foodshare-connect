import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaBoxOpen, FaInbox } from "react-icons/fa";
import { getAvailableDonations, createRequest } from "../services/api";
import DonationCard from "../components/DonationCard";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [foodType, setFoodType] = useState("");
  const [requestTarget, setRequestTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const name = localStorage.getItem("name");

  const loadDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (city) params.city = city;
      if (foodType) params.foodType = foodType;
      const { data } = await getAvailableDonations(params);
      setDonations(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadDonations();
  };

  const handleRequestSubmit = async () => {
    setSubmitting(true);
    try {
      await createRequest({ foodDonationId: requestTarget._id, message });
      toast.success("Request sent to donor!");
      setRequestTarget(null);
      setMessage("");
      loadDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {name}</h1>
          <p>Browse available food donations near you.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/receiver/my-requests" className="btn btn-outline">
            <FaInbox /> My Requests
          </Link>
        </div>
      </div>

      <form className="filters-bar" onSubmit={handleFilter}>
        <input
          className="form-control"
          placeholder="Filter by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <select
          className="form-control"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
        >
          <option value="">All Food Types</option>
          {foodTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          <FaSearch /> Search
        </button>
      </form>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading available donations...</div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBoxOpen />
          </div>
          <p>No donations available yet. Please check back soon.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              role="receiver"
              onRequest={setRequestTarget}
            />
          ))}
        </div>
      )}

      {requestTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Request "{requestTarget.foodName}"</h3>
            <div className="form-group">
              <label>Message to donor (optional)</label>
              <textarea
                className="form-control"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. We can pick this up by 6 PM today."
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setRequestTarget(null);
                  setMessage("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRequestSubmit}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverDashboard;
