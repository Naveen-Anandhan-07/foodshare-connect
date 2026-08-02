import {
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { FaInbox } from "react-icons/fa";
import {
  getMyRequests,
  cancelRequest,
  createReceiverReview,
} from "../services/api";
import RequestCard from "../components/RequestCard";

function getErrorMessage(
  error,
  defaultMessage
) {
  if (
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    return error.response.data.message;
  }

  return defaultMessage;
}

function MyRequests() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response =
        await getMyRequests();

      setRequests(response.data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Failed to load requests"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadRequests();
  }, []);

  async function handleCancel(
    request
  ) {
    try {
      await cancelRequest(request._id);
      toast.success("Request cancelled");
      loadRequests();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to cancel request"
        )
      );
    }
  }

  async function handleReview(
    request,
    rating,
    feedback
  ) {
    try {
      await createReceiverReview(
        request._id,
        {
          rating: rating,
          feedback: feedback,
        }
      );

      toast.success(
        "Review submitted"
      );

      loadRequests();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to submit review"
        )
      );
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Requests</h1>

          <p>
            Track requests and review
            completed pickups.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          Loading your requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <FaInbox />
          <p>
            You have not requested any
            food yet.
          </p>
        </div>
      ) : (
        <div className="donation-grid">
          {requests.map(
            function (request) {
              return (
                <RequestCard
                  key={request._id}
                  request={request}
                  role="receiver"
                  onCancel={
                    handleCancel
                  }
                  onReview={
                    handleReview
                  }
                />
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default MyRequests;