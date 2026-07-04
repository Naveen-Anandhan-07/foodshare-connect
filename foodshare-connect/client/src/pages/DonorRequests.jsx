import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaInbox } from "react-icons/fa";
import {
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
} from "../services/api";
import RequestCard from "../components/RequestCard";

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getDonorRequests();
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (request) => {
    try {
      await acceptRequest(request._id);
      toast.success("Request accepted");
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (request) => {
    try {
      await rejectRequest(request._id);
      toast.success("Request rejected");
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  };

  const handleComplete = async (request) => {
    try {
      await completeRequest(request._id);
      toast.success("Marked as completed");
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete request");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Requests Received</h1>
          <p>Review and manage requests from receivers for your donations.</p>
        </div>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaInbox />
          </div>
          <p>No requests available yet.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              role="donor"
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorRequests;
