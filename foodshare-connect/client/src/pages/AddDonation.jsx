import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createDonation,
} from "../services/api";

const foodTypes = [
  "Cooked Food",
  "Raw Ingredients",
  "Packaged Food",
  "Fruits/Vegetables",
  "Bakery Items",
  "Others",
];

const initialState = {
  foodName: "",
  foodType: "Cooked Food",
  quantity: "",
  pickupLocation: "",
  city: "",
  expiryTime: "",
  description: "",
};

function getMinimumDateTime() {
  const date = new Date();

  date.setMinutes(
    date.getMinutes() + 1
  );

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return (
    year +
    "-" +
    month +
    "-" +
    day +
    "T" +
    hours +
    ":" +
    minutes
  );
}

function AddDonation() {
  const [formData, setFormData] =
    useState(initialState);

  const [foodImage, setFoodImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const minimumDateTime =
    getMinimumDateTime();

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
      setFoodImage(null);
      setImagePreview("");
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

    setFoodImage(selectedFile);

    setImagePreview(
      URL.createObjectURL(selectedFile)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!foodImage) {
      toast.error(
        "Please select a food image"
      );

      return;
    }

    const selectedExpiry =
      new Date(
        formData.expiryTime
      );

    const currentTime = new Date();

    if (
      selectedExpiry <= currentTime
    ) {
      toast.error(
        "Expiry time must be in the future"
      );

      return;
    }

    setLoading(true);

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

      donationData.append(
        "foodImage",
        foodImage
      );

      await createDonation(
        donationData
      );

      toast.success(
        "Food donation posted successfully!"
      );

      navigate("/donor/dashboard");
    } catch (error) {
      let message =
        "Failed to post donation";

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
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div
        className="auth-card"
        style={{
          maxWidth: 560,
        }}
      >
        <h2>Add Food Donation</h2>

        <p className="auth-subtitle">
          Share details about your surplus
          food.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Image</label>

            <input
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              required
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
              placeholder="e.g. Vegetable Biryani"
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
                placeholder="e.g. Serves 20 people"
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

          <div className="form-group">
            <label>Expiry Time</label>

            <input
              type="datetime-local"
              className="form-control"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              min={minimumDateTime}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Description (optional)
            </label>

            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any extra details receivers should know"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? "Posting..."
              : "Post Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;