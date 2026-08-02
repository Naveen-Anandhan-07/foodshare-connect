import {
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { FaInbox } from "react-icons/fa";
import {
  getDonorRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  createDonorReview,
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

function DonorRequests() {
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
        await getDonorRequests();

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

    const timer = setInterval(
      async function () {
        try {
          const response =
            await getDonorRequests();
          setRequests(response.data);
        } catch (error) {
          return;
        }
      },
      30000
    );

    return function () {
      clearInterval(timer);
    };
  }, []);

  async function handleAccept(
    request
  ) {
    try {
      await acceptRequest(request._id);
      toast.success("Request accepted");
      loadRequests();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to accept request"
        )
      );
    }
  }

  async function handleReject(
    request
  ) {
    try {
      await rejectRequest(request._id);
      toast.success("Request rejected");
      loadRequests();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to reject request"
        )
      );
    }
  }

  async function handleComplete(
    request,
    otp
  ) {
    try {
      await completeRequest(
        request._id,
        otp
      );

      toast.success(
        "Pickup confirmed"
      );

      loadRequests();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to confirm pickup"
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
      await createDonorReview(
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
          <h1>Requests Received</h1>
          <p>
            Manage requests, pickups and
            reviews.
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
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <FaInbox />
          <p>No requests available.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {requests.map(
            function (request) {
              return (
                <RequestCard
                  key={request._id}
                  request={request}
                  role="donor"
                  onAccept={
                    handleAccept
                  }
                  onReject={
                    handleReject
                  }
                  onComplete={
                    handleComplete
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

export default DonorRequests;
