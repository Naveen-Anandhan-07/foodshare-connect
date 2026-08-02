import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FaBan,
  FaCheckCircle,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaStar,
  FaTimesCircle,
  FaUserClock,
} from "react-icons/fa";
import {
  getAdminDonors,
  getFlaggedReviews,
  updateDonorFssaiStatus,
} from "../services/api";

const statusOptions = ["All", "Pending", "Verified", "Rejected"];

function AdminDashboard() {
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [flaggedReviews, setFlaggedReviews] = useState([]);

  async function loadDonors() {
    setLoading(true);

    try {
      const response = await getAdminDonors(status);
      setDonors(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load donors");
    } finally {
      setLoading(false);
    }
  }

  async function loadFlaggedReviews() {
    try {
      const response = await getFlaggedReviews();
      setFlaggedReviews(response.data);
    } catch (error) {
      toast.error("Unable to load flagged reviews");
    }
  }

  useEffect(
    function () {
      loadDonors();
    },
    [status]
  );

  useEffect(function () {
    loadFlaggedReviews();
  }, []);

  const totals = useMemo(
    function () {
      return donors.reduce(
        function (summary, donor) {
          const donorStatus = donor.fssaiStatus || "Pending";
          summary.total += 1;
          summary[donorStatus] += 1;
          return summary;
        },
        {
          total: 0,
          Pending: 0,
          Verified: 0,
          Rejected: 0,
        }
      );
    },
    [donors]
  );

  const verifiedDonors = donors.filter(function (donor) {
    return donor.fssaiStatus === "Verified";
  });

  function getBadgeClass(donorStatus) {
    if (donorStatus === "Verified") {
      return "badge badge-accepted";
    }

    if (donorStatus === "Rejected") {
      return "badge badge-rejected";
    }

    return "badge badge-pending";
  }

  async function verifyDonor(donor) {
    const confirmed = window.confirm(
      "Verify " + donor.organizationName + " as an approved donor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateDonorFssaiStatus(donor._id, {
        status: "Verified",
      });

      toast.success("Donor verified");
      loadDonors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  }

  async function rejectDonor(donor) {
    const reason = window.prompt("Enter the rejection reason");

    if (!reason) {
      return;
    }

    try {
      await updateDonorFssaiStatus(donor._id, {
        status: "Rejected",
        rejectionReason: reason,
      });

      toast.success("Donor rejected");
      loadDonors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  }

  async function cancelVerification(donor) {
    const confirmed = window.confirm(
      "Cancel verification for " +
        donor.organizationName +
        "? This donor will lose donor access."
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateDonorFssaiStatus(donor._id, {
        status: "Rejected",
        rejectionReason: "Verification cancelled by admin",
      });

      toast.success("Verification cancelled");
      loadDonors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel verification");
    }
  }

  function renderDonorActions(donor) {
    if (donor.fssaiStatus === "Verified") {
      return (
        <button
          className="btn btn-danger btn-sm"
          onClick={function () {
            cancelVerification(donor);
          }}
        >
          <FaBan /> Cancel Verification
        </button>
      );
    }

    return (
      <>
        <button
          className="btn btn-primary btn-sm"
          onClick={function () {
            verifyDonor(donor);
          }}
        >
          <FaCheckCircle /> Verify
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={function () {
            rejectDonor(donor);
          }}
        >
          <FaTimesCircle /> Reject
        </button>
      </>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Review FSSAI registrations, monitor verified donors, and manage trust signals.</p>
        </div>

        <a
          href="https://foscos.fssai.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
        >
          Open FoSCoS <FaExternalLinkAlt />
        </a>
      </div>

      <div className="admin-summary-grid">
        <div className="card stat-card">
          <div className="stat-icon">
            <FaClipboardCheck />
          </div>
          <h3>{totals.total}</h3>
          <p>Total donors in view</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <FaUserClock />
          </div>
          <h3>{totals.Pending}</h3>
          <p>Pending review</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <h3>{totals.Verified}</h3>
          <p>Verified donors</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <FaTimesCircle />
          </div>
          <h3>{totals.Rejected}</h3>
          <p>Rejected or blocked</p>
        </div>
      </div>

      <div className="filters-bar">
        <strong>Filter donors</strong>
        <select
          className="form-control"
          value={status}
          onChange={function (event) {
            setStatus(event.target.value);
          }}
        >
          {statusOptions.map(function (option) {
            return (
              <option key={option} value={option}>
                {option === "All" ? "All Donors" : option}
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading donors...</div>
      ) : donors.length === 0 ? (
        <div className="empty-state">
          <h3>No donors match this filter</h3>
          <p>Switch to All Donors to review pending, verified, and rejected accounts.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {donors.map(function (donor) {
            return (
              <div className="donation-card admin-donor-card" key={donor._id}>
                <div className="donation-card-header">
                  <h3>{donor.organizationName}</h3>
                  <span className={getBadgeClass(donor.fssaiStatus)}>
                    {donor.fssaiStatus || "Pending"}
                  </span>
                </div>

                <div className="donation-meta">
                  <span>
                    <strong>Owner:</strong> {donor.name}
                  </span>
                  <span>
                    <strong>Email:</strong> {donor.email}
                  </span>
                  <span>
                    <strong>Phone:</strong> {donor.phone}
                  </span>
                  <span>
                    <strong>City:</strong> {donor.city}
                  </span>
                  <span>
                    <strong>Address:</strong> {donor.address}
                  </span>
                  <span>
                    <strong>FSSAI:</strong> {donor.fssaiNumber}
                  </span>
                  {donor.fssaiVerifiedAt && (
                    <span>
                      <strong>Verified:</strong>{" "}
                      {new Date(donor.fssaiVerifiedAt).toLocaleString()}
                    </span>
                  )}
                  {donor.fssaiRejectionReason && (
                    <span>
                      <strong>Reason:</strong> {donor.fssaiRejectionReason}
                    </span>
                  )}
                </div>

                <div className="donation-actions">{renderDonorActions(donor)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="section-heading-split mt-3">
        <div>
          <h2 className="section-title text-left">Verified Donor List</h2>
          <p className="section-subtitle text-left">
            Active donors who can currently use donor-only features.
          </p>
        </div>
      </div>

      {verifiedDonors.length === 0 ? (
        <div className="empty-state">
          <h3>No verified donors in this view</h3>
          <p>Verified accounts will appear here with a cancel-verification action.</p>
        </div>
      ) : (
        <div className="admin-verified-list">
          {verifiedDonors.map(function (donor) {
            return (
              <div className="admin-verified-row" key={donor._id}>
                <div>
                  <strong>{donor.organizationName}</strong>
                  <span>
                    {donor.name} - {donor.city} - FSSAI {donor.fssaiNumber}
                  </span>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={function () {
                    cancelVerification(donor);
                  }}
                >
                  <FaBan /> Cancel Verification
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="section-heading-split mt-3">
        <div>
          <h2 className="section-title text-left">Low-rated Reviews</h2>
          <p className="section-subtitle text-left">
            Follow up on completed pickups that received weak feedback.
          </p>
        </div>
      </div>

      {flaggedReviews.length === 0 ? (
        <div className="empty-state">
          <FaStar className="empty-icon" />
          <h3>No low-rated reviews found</h3>
          <p>Reviews rated 2 stars or below will be listed here for admin follow-up.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {flaggedReviews.map(function (review) {
            const donor = review.donorId || {};
            const receiver = review.receiverId || {};
            const donation = review.donationId || {};

            return (
              <div className="donation-card" key={review._id}>
                <div className="donation-card-header">
                  <h3>{donation.foodName || "Food donation"}</h3>
                  <span className="badge badge-rejected">{review.rating}/5</span>
                </div>

                <div className="donation-meta">
                  <span>
                    <strong>Review by:</strong> {review.reviewerRole}
                  </span>
                  <span>
                    <strong>Donor:</strong>{" "}
                    {donor.organizationName || donor.name || "Unknown"}
                  </span>
                  <span>
                    <strong>Receiver:</strong>{" "}
                    {receiver.organizationName || receiver.name || "Unknown"}
                  </span>
                  <span>
                    <strong>Feedback:</strong> {review.feedback || "No written feedback"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
