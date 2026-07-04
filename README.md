# FoodShare Connect 🌱

A full-stack MERN web application that helps reduce food wastage by connecting **food donors** (restaurants, hostels, homes, event organizers, grocery stores) with **food receivers** (NGOs, shelters, volunteers, and needy individuals).

## Description

FoodShare Connect gives donors a simple way to post surplus food that would otherwise go to waste, and gives receivers an easy way to discover and request that food. The platform keeps the business logic simple and beginner-friendly, while the UI is polished, responsive, and themed around trust and social impact (green & white).

## Features

- Separate registration/login flows for Donors and Receivers (JWT-based auth)
- Donor dashboard: add, edit, delete donations; track status (Available, Requested, Completed, Expired)
- Receiver dashboard: browse available food, filter by city/food type, request food
- Request workflow: Pending → Accepted/Rejected → Completed, with Cancel for receivers
- Role-based protected routes on the frontend and role-based middleware on the backend
- Status badges, empty states, loading/error states, and delete confirmation modals
- Toast notifications for success/error feedback
- Automatic "Expired" badge once a donation's expiry time has passed

## Tech Stack

**Frontend:** React.js, React Router, Axios, React Icons, React Toastify, Vite
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv, CORS

## Folder Structure

```
foodshare-connect/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, DonationCard, RequestCard
│   │   ├── pages/               # Home, Login/Register, Dashboards, Add/Edit Donation, Requests
│   │   ├── services/api.js      # Axios instance + all API calls
│   │   ├── styles/global.css    # Green & white theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/                     # Express backend
    ├── config/db.js             # MongoDB connection
    ├── controllers/             # donor, receiver, donation, request controllers
    ├── middleware/authMiddleware.js  # protectDonor, protectReceiver
    ├── models/                  # Donor, Receiver, FoodDonation, FoodRequest
    ├── routes/                  # donor, receiver, donation, request routes
    ├── utils/generateToken.js
    ├── server.js
    └── package.json
```

## Environment Variables

### server/.env

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/foodshare_connect
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### client/.env

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Copy the provided `.env.example` files in both `server/` and `client/` and rename them to `.env`, then fill in your own values.

## Backend Setup

```bash
cd server
npm install
cp .env.example .env   # then edit values as needed
npm run dev             # starts server with nodemon on http://localhost:5000
```

Make sure MongoDB is running locally, or set `MONGO_URI` to a MongoDB Atlas connection string.

## Frontend Setup

```bash
cd client
npm install
cp .env.example .env    # then edit values as needed
npm run dev              # starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## API List

### Donor APIs
- `POST /api/donors/register`
- `POST /api/donors/login`
- `GET /api/donors/profile` (protected)
- `PUT /api/donors/profile` (protected)
- `DELETE /api/donors/profile` (protected)

### Receiver APIs
- `POST /api/receivers/register`
- `POST /api/receivers/login`
- `GET /api/receivers/profile` (protected)
- `PUT /api/receivers/profile` (protected)
- `DELETE /api/receivers/profile` (protected)

### Food Donation APIs
- `POST /api/donations` (donor only)
- `GET /api/donations`
- `GET /api/donations/available`
- `GET /api/donations/my-donations` (donor only)
- `GET /api/donations/:id`
- `PUT /api/donations/:id` (donor only, owner)
- `DELETE /api/donations/:id` (donor only, owner)

### Food Request APIs
- `POST /api/requests` (receiver only)
- `GET /api/requests/my-requests` (receiver only)
- `GET /api/requests/donor-requests` (donor only)
- `PUT /api/requests/:id/accept` (donor only)
- `PUT /api/requests/:id/reject` (donor only)
- `PUT /api/requests/:id/complete` (donor only)
- `PUT /api/requests/:id/cancel` (receiver only, if Pending)

## Future Enhancements

- Google Maps integration for pickup locations
- Food image upload
- Admin dashboard for platform oversight
- Email/SMS notifications for requests and status changes
- Volunteer delivery tracking
- Donation analytics and reporting
- Food safety verification checks

## License

This project was built as an educational / college project and is free to use and modify.
