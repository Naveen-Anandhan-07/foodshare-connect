import { useState } from "react";
import {
  FaBoxOpen,
  FaUser,
  FaCommentDots,
  FaKey,
} from "react-icons/fa";
import LocationSharing from "./LocationSharing";

const statusBadgeClass = {
  Pending: "badge-pending",
  Accepted: "badge-accepted",
  Rejected: "badge-rejected",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled",
};

function RequestCard(props) {
  const request = props.request;
  const role = props.role;
  const onAccept = props.onAccept;
  const onReject = props.onReject;
  const onComplete = props.onComplete;
  const onCancel = props.onCancel;

  const [otp, setOtp] =
    useState("");

  const donation =
    request.foodDonationId;

  let otherParty = null;

  if (role === "donor") {
    otherParty = request.receiverId;
  } else {
    otherParty = request.donorId;
  }

  let foodName = "Food donation";

  if (
    donation &&
    donation.foodName
  ) {
    foodName = donation.foodName;
  }

  let phone = "";
  let email = "";
  let partyName = "";

  if (otherParty) {
    phone = otherParty.phone || "";
    email = otherParty.email || "";

    partyName =
      otherParty.organizationName ||
      otherParty.name ||
      "";
  }

  function handleOtpChange(event) {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 6) {
      setOtp(value);
    }
  }

  function handleAccept() {
    onAccept(request);
  }

  function handleReject() {
    onReject(request);
  }

  function handleComplete() {
    onComplete(request, otp);
  }

  function handleCancel() {
    onCancel(request);
  }

  return (
    <div className="donation-card">
      <div className="donation-card-header">
        <h3>{foodName}</h3>

        <span
          className={
            "badge " +
            (
              statusBadgeClass[
                request.status
              ] || ""
            )
          }
        >
          {request.status}
        </span>
      </div>

      <div className="donation-meta">
        {donation && (
          <span>
            <FaBoxOpen />
            {donation.foodType}
            {" · "}
            {donation.quantity}
          </span>
        )}

        {partyName && (
          <span>
            <FaUser />
            {partyName}
          </span>
        )}

        {(phone || email) && (
          <div className="donation-contact">
            <strong>
              Contact{" "}
              {role === "donor"
                ? "receiver"
                : "donor"}
              :
            </strong>

            {phone && (
              <span>
                Phone: {phone}
              </span>
            )}

            {email && (
              <span>
                Email: {email}
              </span>
            )}
          </div>
        )}

        {request.message && (
          <span>
            <FaCommentDots />
            {request.message}
          </span>
        )}
      </div>

      {role === "receiver" &&
        request.status ===
          "Accepted" && (
          <>
          <div
            style={{
              background: "#dcfce7",
              border:
                "1px solid #16a34a",
              borderRadius: "8px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <FaKey
              style={{
                color: "#166534",
              }}
            />

            <strong
              style={{
                display: "block",
                marginTop: "6px",
              }}
            >
              Pickup OTP
            </strong>

            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                letterSpacing: "6px",
                color: "#166534",
                marginTop: "6px",
              }}
            >
              {request.pickupOtp ||
                "------"}
            </div>

            <small>
              Give this OTP to the donor
              only when collecting food.
            </small>
          </div>
          <div
            style={{
              marginTop: "12px",
            }}
          >
            <LocationSharing
              request={request}
            />
            <p
              style={{
                fontSize: "0.8rem",
                color: "#4b5563",
                marginTop: "8px",
              }}
            >
              Your position updates every
              30 seconds while this page is
              open.
            </p>
          </div>
          </>
        )}

      {role === "donor" &&
        request.status === "Accepted" &&
        request.isLocationShared &&
        request.receiverLatitude !== null &&
        request.receiverLongitude !== null && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #2563eb",
              borderRadius: "8px",
              padding: "14px",
              marginTop: "12px",
            }}
          >
            <strong>
              Receiver location is being
              shared
            </strong>
            <p
              style={{
                fontSize: "0.82rem",
                margin: "8px 0",
              }}
            >
              Last updated: {" "}
              {request.locationUpdatedAt
                ? new Date(
                    request.locationUpdatedAt
                  ).toLocaleTimeString()
                : "Just now"}
            </p>
            <a
              className="btn btn-primary btn-sm"
              href={
                "https://www.google.com/maps?q=" +
                request.receiverLatitude +
                "," +
                request.receiverLongitude
              }
              target="_blank"
              rel="noreferrer"
            >
              Open Receiver Location
            </a>
          </div>
        )}

      <div className="donation-actions">
        {role === "donor" &&
          request.status ===
            "Pending" && (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAccept}
              >
                Accept
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          )}

        {role === "donor" &&
          request.status ===
            "Accepted" && (
            <div
              style={{
                width: "100%",
              }}
            >
              <div className="form-group">
                <label>
                  Enter Receiver Pickup OTP
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={
                    handleOtpChange
                  }
                  maxLength="6"
                  placeholder="6-digit OTP"
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={
                  handleComplete
                }
                disabled={
                  otp.length !== 6
                }
              >
                Confirm Pickup
              </button>
            </div>
          )}

        {role === "receiver" &&
          request.status ===
            "Pending" && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleCancel}
            >
              Cancel Request
            </button>
          )}
      </div>
    </div>
  );
}

export default RequestCard;
