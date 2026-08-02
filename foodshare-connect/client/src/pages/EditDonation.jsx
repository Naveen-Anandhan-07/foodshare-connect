import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  getDonationById,
  updateDonation,
  SERVER_BASE_URL,
} from "../services/api";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

function addZero(number) {
  return String(number).padStart(
    2,
    "0"
  );
}

function formatDateForInput(isoDate) {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  return (
    date.getFullYear() +
    "-" +
    addZero(date.getMonth() + 1) +
    "-" +
    addZero(date.getDate()) +
    "T" +
    addZero(date.getHours()) +
    ":" +
    addZero(date.getMinutes())
  );
}

function getMinimumDateTime() {
  const date = new Date();

  date.setMinutes(
    date.getMinutes() + 1
  );

  return (
    date.getFullYear() +
    "-" +
    addZero(date.getMonth() + 1) +
    "-" +
    addZero(date.getDate()) +
    "T" +
    addZero(date.getHours()) +
    ":" +
    addZero(date.getMinutes())
  );
}

function EditDonation() {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(null);

  const [newImage, setNewImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const minimumDateTime =
    getMinimumDateTime();

  useEffect(
    function () {
      async function loadDonation() {
        try {
          const response =
            await getDonationById(id);

          const donation = response.data;

          setFormData({
            foodName: donation.foodName,
            foodType: donation.foodType,
            quantity: donation.quantity,
            pickupLocation:
              donation.pickupLocation,
            city: donation.city,
            expiryTime:
              formatDateForInput(
                donation.expiryTime
              ),
            description:
              donation.description || "",
            status: donation.status,
          });

          if (donation.image) {
            setImagePreview(
              SERVER_BASE_URL +
                "/" +
                donation.image
            );
          }
        } catch (error) {
          let message =
            "Failed to load donation";

          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message =
              error.response.data.message;
          }

          setError(message);
        } finally {
          setLoading(false);
        }
      }

      loadDonation();
    },
    [id]
  );

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleImageChange(event) {
    const selectedFile =
      event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image size cannot exceed 5 MB"
      );

      event.target.value = "";
      return;
    }

    setNewImage(selectedFile);

    setImagePreview(
      URL.createObjectURL(selectedFile)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const selectedExpiry =
      new Date(
        formData.expiryTime
      );

    const currentTime = new Date();

    const expiryCanBePast =
      formData.status === "Expired" ||
      formData.status === "Completed";

    if (
      selectedExpiry <= currentTime &&
      !expiryCanBePast
    ) {
      toast.error(
        "Expiry time must be in the future"
      );

      return;
    }

    setSaving(true);

    try {
      const donationData =
        new FormData();

      donationData.append(
        "foodName",
        formData.foodName
      );

      donationData.append(
        "foodType",
        formData.foodType
      );

      donationData.append(
        "quantity",
        formData.quantity
      );

      donationData.append(
        "pickupLocation",
        formData.pickupLocation
      );

      donationData.append(
        "city",
        formData.city
      );

      donationData.append(
        "expiryTime",
        formData.expiryTime
      );

      donationData.append(
        "description",
        formData.description
      );

      if (newImage) {
        donationData.append(
          "foodImage",
          newImage
        );
      }

      await updateDonation(
        id,
        donationData
      );

      toast.success(
        "Donation updated successfully!"
      );

      navigate("/donor/dashboard");
    } catch (error) {
      let message =
        "Failed to update donation";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message =
          error.response.data.message;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        Loading donation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state container mt-3">
        {error}
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="auth-wrapper">
      <div
        className="auth-card"
        style={{
          maxWidth: 560,
        }}
      >
        <h2>Edit Food Donation</h2>

        <p className="auth-subtitle">
          Update the donation details and
          image.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Replace Food Image
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Food preview"
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            />
          )}

          <div className="form-group">
            <label>Food Name</label>

            <input
              className="form-control"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Food Type</label>

              <select
                className="form-control"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
              >
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
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Pickup Location
              </label>

              <input
                className="form-control"
                name="pickupLocation"
                value={
                  formData.pickupLocation
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Time</label>

              <input
                type="datetime-local"
                className="form-control"
                name="expiryTime"
                value={
                  formData.expiryTime
                }
                onChange={handleChange}
                min={
                  formData.status ===
                    "Expired" ||
                  formData.status ===
                    "Completed"
                    ? undefined
                    : minimumDateTime
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <input
                className="form-control"
                value={formData.status}
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Description (optional)
            </label>

            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={
                formData.description
              }
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditDonation;
