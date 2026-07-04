import { FaMapMarkerAlt, FaClock, FaBoxOpen, FaBuilding } from "react-icons/fa";

const statusBadgeClass = {
  Available: "badge-available",
  Requested: "badge-requested",
  Completed: "badge-completed",
  Expired: "badge-expired",
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// donation: the food donation object
// role: "donor" | "receiver" - controls which action buttons show
// onEdit, onDelete, onRequest: callbacks
const DonationCard = ({ donation, role, onEdit, onDelete, onRequest }) => {
  return (
    <div className="donation-card">
      <div className="donation-card-header">
        <h3>{donation.foodName}</h3>
        <span className={`badge ${statusBadgeClass[donation.status] || ""}`}>
          {donation.status}
        </span>
      </div>

      <div className="donation-meta">
        <span>
          <FaBoxOpen /> {donation.foodType} &middot; {donation.quantity}
        </span>
        <span>
          <FaMapMarkerAlt /> {donation.pickupLocation}, {donation.city}
        </span>
        <span>
          <FaClock /> Expires: {formatDate(donation.expiryTime)}
        </span>
        {donation.donorId?.organizationName && (
          <span>
            <FaBuilding /> {donation.donorId.organizationName}
          </span>
        )}
      </div>

      {(donation.donorId?.phone || donation.donorId?.email) && (
        <div className="donation-contact">
          <strong>Contact donor:</strong>
          {donation.donorId?.phone && <span>Phone: {donation.donorId.phone}</span>}
          {donation.donorId?.email && <span>Email: {donation.donorId.email}</span>}
        </div>
      )}

      {donation.description && (
        <p style={{ fontSize: "0.88rem", color: "#4b5563", margin: 0 }}>
          {donation.description}
        </p>
      )}

      <div className="donation-actions">
        {role === "donor" && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => onEdit(donation)}>
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(donation)}>
              Delete
            </button>
          </>
        )}

        {role === "receiver" && donation.status === "Available" && (
          <button className="btn btn-primary btn-sm" onClick={() => onRequest(donation)}>
            Request Food
          </button>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
