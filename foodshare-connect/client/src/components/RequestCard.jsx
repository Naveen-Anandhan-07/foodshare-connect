import { FaBoxOpen, FaUser, FaCommentDots } from "react-icons/fa";

const statusBadgeClass = {
  Pending: "badge-pending",
  Accepted: "badge-accepted",
  Rejected: "badge-rejected",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled",
};

// request: the food request object (populated with foodDonationId + donorId/receiverId)
// role: "donor" | "receiver"
// onAccept, onReject, onComplete, onCancel: callbacks
const RequestCard = ({
  request,
  role,
  onAccept,
  onReject,
  onComplete,
  onCancel,
}) => {
  const donation = request.foodDonationId;
  const otherParty = role === "donor" ? request.receiverId : request.donorId;

  return (
    <div className="donation-card">
      <div className="donation-card-header">
        <h3>{donation?.foodName || "Food donation"}</h3>
        <span className={`badge ${statusBadgeClass[request.status] || ""}`}>
          {request.status}
        </span>
      </div>

      <div className="donation-meta">
        {donation && (
          <span>
            <FaBoxOpen /> {donation.foodType} &middot; {donation.quantity}
          </span>
        )}
        {otherParty && (
          <span>
            <FaUser /> {otherParty.organizationName || otherParty.name}
          </span>
        )}
        {(otherParty?.phone || otherParty?.email) && (
          <div className="donation-contact">
            <strong>
              Contact {role === "donor" ? "receiver" : "donor"}:
            </strong>
            {otherParty?.phone && <span>Phone: {otherParty.phone}</span>}
            {otherParty?.email && <span>Email: {otherParty.email}</span>}
          </div>
        )}
        {request.message && (
          <span>
            <FaCommentDots /> {request.message}
          </span>
        )}
      </div>

      <div className="donation-actions">
        {role === "donor" && request.status === "Pending" && (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => onAccept(request)}>
              Accept
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onReject(request)}>
              Reject
            </button>
          </>
        )}

        {role === "donor" && request.status === "Accepted" && (
          <button className="btn btn-primary btn-sm" onClick={() => onComplete(request)}>
            Mark Completed
          </button>
        )}

        {role === "receiver" && request.status === "Pending" && (
          <button className="btn btn-danger btn-sm" onClick={() => onCancel(request)}>
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
