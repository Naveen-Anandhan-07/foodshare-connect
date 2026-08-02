const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use(
  "/api/donors",
  require("./routes/donorRoutes")
);

app.use(
  "/api/receivers",
  require("./routes/receiverRoutes")
);

app.use(
  "/api/donations",
  require("./routes/donationRoutes")
);

app.use(
  "/api/requests",
  require("./routes/requestRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use(
  "/api/reviews",
  require("./routes/reviewRoutes")
);

app.get("/", function (req, res) {
  res.send(
    "FoodShare Connect API is running..."
  );
});

app.use(function (req, res) {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(
  function (error, req, res, next) {
    console.error(error.stack);

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        message:
          "Image size cannot exceed 5 MB",
      });
    }

    res.status(500).json({
      message:
        error.message ||
        "Something went wrong",
    });
  }
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(
    "Server running on port " + PORT
  );
});