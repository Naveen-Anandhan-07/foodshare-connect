import {
  useEffect,
  useState,
} from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBoxOpen,
  FaBuilding,
  FaMap,
} from "react-icons/fa";
import { SERVER_BASE_URL } from "../services/api";

const statusBadgeClass = {
  Available: "badge-available",
  Requested: "badge-requested",
  Completed: "badge-completed",
  Expired: "badge-expired",
};

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function getTimeRemaining(
  expiryTime,
  currentTime
) {
  const expiry =
    new Date(expiryTime).getTime();

  const difference =
    expiry - currentTime;

  if (difference <= 0) {
    return "Expired";
  }

  const totalSeconds =
    Math.floor(difference / 1000);

  const days =
    Math.floor(
      totalSeconds / 86400
    );

  const hours =
    Math.floor(
      (totalSeconds % 86400) /
        3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  if (days > 0) {
    return (
      days +
      "d " +
      hours +
      "h " +
      minutes +
      "m"
    );
  }

  if (hours > 0) {
    return (
      hours +
      "h " +
      minutes +
      "m " +
      seconds +
      "s"
    );
  }

  return (
    minutes +
    "m " +
    seconds +
    "s"
  );
}

function DonationCard(props) {
  const donation = props.donation;
  const role = props.role;
  const onEdit = props.onEdit;
  const onDelete = props.onDelete;
  const onRequest = props.onRequest;

  const [currentTime, setCurrentTime] =
    useState(Date.now());

  useEffect(function () {
    const timer = setInterval(
      function () {
        setCurrentTime(Date.now());
      },
      1000
    );

    return function () {
      clearInterval(timer);
    };
  }, []);

  const expiryTime =
    new Date(
      donation.expiryTime
    ).getTime();

  const expired =
    currentTime >= expiryTime;

  let displayedStatus =
    donation.status;

  if (
    expired &&
    (donation.status ===
      "Available" ||
      donation.status ===
        "Requested")
  ) {
    displayedStatus = "Expired";
  }

  const timeRemaining =
    getTimeRemaining(
      donation.expiryTime,
      currentTime
    );

  let imageUrl = "";

  if (donation.image) {
    imageUrl =
      SERVER_BASE_URL +
      "/" +
      donation.image;
  }

  let organizationName = "";
  let donorPhone = "";
  let donorEmail = "";

  if (donation.donorId) {
    organizationName =
      donation.donorId
        .organizationName || "";

    donorPhone =
      donation.donorId.phone || "";

    donorEmail =
      donation.donorId.email || "";
  }

  const completeAddress =
    donation.pickupLocation +
    ", " +
    donation.city;

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      completeAddress
    );

  function handleEdit() {
    if (onEdit) {
      onEdit(donation);
    }
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(donation);
    }
  }

  function handleRequest() {
    if (onRequest) {
      onRequest(donation);
    }
  }

  return (
    <div className="donation-card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={donation.foodName}
          style={{
            width: "100%",
            height: "190px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}

      <div className="donation-card-header">
        <h3>{donation.foodName}</h3>

        <span
          className={
            "badge " +
            (statusBadgeClass[
              displayedStatus
            ] || "")
          }
        >
          {displayedStatus}
        </span>
      </div>

      <div className="donation-meta">
        <span>
          <FaBoxOpen />
          {donation.foodType}
          {" - "}
          {donation.quantity}
        </span>

        <span>
          <FaMapMarkerAlt />
          {completeAddress}
        </span>

        <span>
          <FaClock />
          Expiry:{" "}
          {formatDate(
            donation.expiryTime
          )}
        </span>

        <span
          style={{
            color: expired
              ? "#dc2626"
              : "#d97706",
            fontWeight: "700",
          }}
        >
          <FaClock />

          {expired
            ? "Food has expired"
            : "Expires in " +
              timeRemaining}
        </span>

        {organizationName && (
          <span>
            <FaBuilding />
            {organizationName}
          </span>
        )}
      </div>

      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline btn-sm"
        style={{
          display: "inline-flex",
          width: "fit-content",
          marginTop: "10px",
        }}
      >
        <FaMap />
        Open in Google Maps
      </a>

      {(donorPhone ||
        donorEmail) && (
        <div className="donation-contact">
          <strong>
            Contact donor:
          </strong>

          {donorPhone && (
            <span>
              Phone: {donorPhone}
            </span>
          )}

          {donorEmail && (
            <span>
              Email: {donorEmail}
            </span>
          )}
        </div>
      )}

      {donation.description && (
        <p
          style={{
            fontSize: "0.88rem",
            color: "#4b5563",
            margin: 0,
          }}
        >
          {donation.description}
        </p>
      )}

      <div className="donation-actions">
        {role === "donor" && (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}

        {role === "receiver" &&
          displayedStatus ===
            "Available" &&
          !expired && (
            <button
              className="btn btn-primary btn-sm"
              onClick={
                handleRequest
              }
            >
              Request Food
            </button>
          )}
      </div>
    </div>
  );
}

export default DonationCard;
