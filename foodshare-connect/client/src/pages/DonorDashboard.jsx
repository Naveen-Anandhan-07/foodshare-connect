import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaBoxOpen, FaClock, FaCheckCircle, FaInbox } from "react-icons/fa";
import { getMyDonations, deleteDonation } from "../services/api";
import DonationCard from "../components/DonationCard";

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const loadDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMyDonations();
      setDonations(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleEdit = (donation) => {
    navigate(`/donor/edit-donation/${donation._id}`);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteDonation(confirmDelete._id);
      toast.success("Donation deleted");
      setDonations((prev) => prev.filter((d) => d._id !== confirmDelete._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete donation");
    } finally {
      setConfirmDelete(null);
    }
  };

  const total = donations.length;
  const pending = donations.filter((d) => d.status === "Requested").length;
  const completed = donations.filter((d) => d.status === "Completed").length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {name}</h1>
          <p>Manage your surplus food donations and track their status.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/donor/add-donation" className="btn btn-primary">
            <FaPlus /> Add Food Donation
          </Link>
          <Link to="/donor/requests" className="btn btn-outline">
            <FaInbox /> View Requests
          </Link>
        </div>
      </div>

      <div className="grid grid-3 mb-3">
        <div className="card stat-card">
          <div className="stat-icon">
            <FaBoxOpen />
          </div>
          <h3>{total}</h3>
          <p>Total Donations</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <h3>{pending}</h3>
          <p>Pending Requests</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <h3>{completed}</h3>
          <p>Completed Donations</p>
        </div>
      </div>

      <h2 className="mb-2" style={{ color: "var(--dark-green)" }}>
        My Donations
      </h2>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your donations...</div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBoxOpen />
          </div>
          <p>No donations available yet. Add your first donation to get started!</p>
        </div>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              role="donor"
              onEdit={handleEdit}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Donation?</h3>
            <p>
              Are you sure you want to delete "<strong>{confirmDelete.foodName}</strong>
              "? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirmed}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
