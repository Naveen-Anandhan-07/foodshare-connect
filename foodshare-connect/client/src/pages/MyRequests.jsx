import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaInbox } from "react-icons/fa";
import { getMyRequests, cancelRequest } from "../services/api";
import RequestCard from "../components/RequestCard";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMyRequests();
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

  const handleCancel = async (request) => {
    try {
      await cancelRequest(request._id);
      toast.success("Request cancelled");
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Requests</h1>
          <p>Track the status of the food you've requested.</p>
        </div>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaInbox />
          </div>
          <p>You haven't requested any food yet.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              role="receiver"
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
