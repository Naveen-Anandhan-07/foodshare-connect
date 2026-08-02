import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaBoxOpen,
  FaInbox,
  FaTimes,
} from "react-icons/fa";
import {
  getAvailableDonations,
  createRequest,
} from "../services/api";
import DonationCard from "../components/DonationCard";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

function ReceiverDashboard() {
  const [allDonations, setAllDonations] =
    useState([]);

  const [donations, setDonations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [foodType, setFoodType] =
    useState("");

  const [expiryHours, setExpiryHours] =
    useState("");

  const [requestTarget, setRequestTarget] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const name =
    localStorage.getItem("name");

  async function loadDonations() {
    setLoading(true);
    setError("");

    try {
      const response =
        await getAvailableDonations({});

      setAllDonations(response.data);
      setDonations(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load donations";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadDonations();
  }, []);

  function handleFilter(event) {
    event.preventDefault();

    const search =
      searchText.trim().toLowerCase();

    const currentTime = Date.now();

    const filtered =
      allDonations.filter(
        function (donation) {
          const foodName =
            donation.foodName
              ?.toLowerCase() || "";

          const city =
            donation.city
              ?.toLowerCase() || "";

          const pickupLocation =
            donation.pickupLocation
              ?.toLowerCase() || "";

          const matchesSearch =
            !search ||
            foodName.includes(search) ||
            city.includes(search) ||
            pickupLocation.includes(
              search
            );

          const matchesFoodType =
            !foodType ||
            donation.foodType ===
              foodType;

          let matchesExpiry = true;

          if (expiryHours) {
            const expiryTime =
              new Date(
                donation.expiryTime
              ).getTime();

            const maximumExpiry =
              currentTime +
              Number(expiryHours) *
                60 *
                60 *
                1000;

            matchesExpiry =
              expiryTime <= maximumExpiry;
          }

          return (
            matchesSearch &&
            matchesFoodType &&
            matchesExpiry
          );
        }
      );

    setDonations(filtered);
  }

  function clearFilters() {
    setSearchText("");
    setFoodType("");
    setExpiryHours("");
    setDonations(allDonations);
  }

  async function handleRequestSubmit() {
    if (!requestTarget) {
      return;
    }

    setSubmitting(true);

    try {
      await createRequest({
        foodDonationId:
          requestTarget._id,
        message: message,
      });

      toast.success(
        "Request sent to donor!"
      );

      setRequestTarget(null);
      setMessage("");

      loadDonations();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send request";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {name}</h1>

          <p>
            Find available food by name,
            city or pickup area.
          </p>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/receiver/my-requests"
            className="btn btn-outline"
          >
            <FaInbox />
            My Requests
          </Link>
        </div>
      </div>

      <form
        className="filters-bar"
        onSubmit={handleFilter}
      >
        <input
          className="form-control"
          placeholder="Search food, city or pickup area"
          value={searchText}
          onChange={function (event) {
            setSearchText(
              event.target.value
            );
          }}
        />

        <select
          className="form-control"
          value={foodType}
          onChange={function (event) {
            setFoodType(
              event.target.value
            );
          }}
        >
          <option value="">
            All Food Types
          </option>

          {foodTypes.map(
            function (type) {
              return (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              );
            }
          )}
        </select>

        <select
          className="form-control"
          value={expiryHours}
          onChange={function (event) {
            setExpiryHours(
              event.target.value
            );
          }}
        >
          <option value="">
            Any Expiry Time
          </option>

          <option value="2">
            Expiring within 2 hours
          </option>

          <option value="6">
            Expiring within 6 hours
          </option>

          <option value="12">
            Expiring within 12 hours
          </option>

          <option value="24">
            Expiring within 24 hours
          </option>
        </select>

        <button
          type="submit"
          className="btn btn-primary"
        >
          <FaSearch />
          Search
        </button>

        <button
          type="button"
          className="btn btn-outline"
          onClick={clearFilters}
        >
          <FaTimes />
          Clear
        </button>
      </form>

      {!loading && !error && (
        <p
          style={{
            marginBottom: "18px",
            color: "#4b5563",
          }}
        >
          {donations.length} donation
          {donations.length === 1
            ? ""
            : "s"}{" "}
          found
        </p>
      )}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          Loading available donations...
        </div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBoxOpen />
          </div>

          <p>
            No donations match your
            search.
          </p>

          <button
            className="btn btn-outline"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="donation-grid">
          {donations.map(
            function (donation) {
              return (
                <DonationCard
                  key={donation._id}
                  donation={donation}
                  role="receiver"
                  onRequest={
                    setRequestTarget
                  }
                />
              );
            }
          )}
        </div>
      )}

      {requestTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>
              Request "
              {requestTarget.foodName}"
            </h3>

            <div className="form-group">
              <label>
                Message to donor
                (optional)
              </label>

              <textarea
                className="form-control"
                rows="3"
                value={message}
                onChange={function (
                  event
                ) {
                  setMessage(
                    event.target.value
                  );
                }}
                placeholder="We can pick this up by 6 PM today."
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={function () {
                  setRequestTarget(null);
                  setMessage("");
                }}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={
                  handleRequestSubmit
                }
                disabled={submitting}
              >
                {submitting
                  ? "Sending..."
                  : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiverDashboard;