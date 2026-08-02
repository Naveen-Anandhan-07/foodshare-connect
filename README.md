# 🍲 FoodShare Connect

<p align="center">
  <strong>Connecting Surplus Food Donors with NGO & Community Receivers to Eliminate Food Waste & Combat Hunger.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Vite" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Deploy--Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Deploy--Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
  - [1. MongoDB Atlas Setup](#1-mongodb-atlas-setup)
  - [2. Render Backend Deployment](#2-render-backend-deployment)
  - [3. Vercel Frontend Deployment](#3-vercel-frontend-deployment)
- [API Endpoints Summary](#-api-endpoints-summary)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview

**FoodShare Connect** is a full-stack web application designed to bridge the gap between food donors (restaurants, caterers, individuals) and verified receivers (NGOs, orphanages, community centers). It enables real-time food donation posting, OTP-based secure pickup verification, live location sharing, and FSSAI quality verification to ensure safe and efficient food redistribution.

---

## ✨ Key Features

- 🎁 **Donor Dashboard**: Create, manage, and track food donations with food details, quantities, expiry windows, and image uploads.
- 🤝 **Receiver Dashboard**: Search available donations nearby, submit claim requests, and track request status.
- 🔑 **OTP Pickup Verification**: Secure 4-digit OTP system to ensure accurate handoffs between donors and receivers.
- 📍 **Real-Time Location Sharing**: Integrated Google Maps direction links and live coordinate tracking for smooth pickup logistics.
- 🛡️ **Admin Verification Portal**: FSSAI license compliance review system to audit and approve food donors.
- ⭐ **Rating & Review System**: Mutual review system for donors and receivers to maintain trust and safety within the network.
- 🎨 **Modern Responsive UI**: Built with React, Vite, and custom CSS design system optimized for mobile and desktop screens.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Modern Vanilla CSS Design System with Glassmorphic UI Elements
- **Notifications**: React Toastify & React Icons

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer (Multipart Data Handling)

---

## 📂 Project Structure

```text
foodshare-connect/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Cards, Maps)
│   │   ├── pages/              # Page views (Dashboards, Logins, Registration)
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── styles/             # Global CSS design tokens & styles
│   │   ├── App.jsx             # Main Router configuration
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vercel.json             # Vercel SPA Routing Configuration
│   └── vite.config.js
│
├── server/                     # Backend API Server (Node + Express)
│   ├── config/                 # Database configuration (MongoDB connection)
│   ├── controllers/            # Controller logic (Donations, Requests, Users, Admin)
│   ├── middleware/             # Auth JWT, Admin role check, Upload handlers
│   ├── models/                 # Mongoose Data Schemas
│   ├── routes/                 # Express API routes
│   ├── uploads/                # Directory for uploaded donation images
│   ├── utils/                  # Utility functions (JWT generators, helpers)
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express app server entry point
│
├── .gitignore                  # Git ignore rules for node_modules, .env, build files
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Naveen-Anandhan-07/foodshare-connect.git
cd foodshare-connect
```

### 2. Configure & Run Backend
```bash
cd server
npm install
```
Create a `.env` file inside the `server/` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/foodshare_connect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@foodshare.com
ADMIN_PASSWORD=admin123
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure & Run Frontend
In a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file inside the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

### **Server Environment Variables (`server/.env`)**

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT verification | `super_secret_key` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Administrator login email | `admin@foodshare.com` |
| `ADMIN_PASSWORD` | Administrator login password | `admin123` |

### **Client Environment Variables (`client/.env`)**

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base API URL pointing to Express Backend | `http://localhost:5000/api` |

---

## 🌐 Deployment Guide

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an **M0 Free Cluster**.
2. Under **Database Access**, create a user with read/write access.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Copy your Connection String (`mongodb+srv://...`).

### 2. Render Backend Deployment
1. Log in to [Render](https://render.com/) and click **New + -> Web Service**.
2. Connect this GitHub Repository (`foodshare-connect`).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random secret string
   - `CLIENT_URL`: `https://<your-vercel-app>.vercel.app`
   - `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Credentials for admin login
6. Deploy and copy your backend production URL (`https://<your-backend>.onrender.com`).

### 3. Vercel Frontend Deployment
1. Log in to [Vercel](https://vercel.com/) and click **Add New -> Project**.
2. Import this GitHub Repository (`foodshare-connect`).
3. Set **Root Directory** to `client`.
4. Set **Framework Preset** to `Vite`.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://<your-backend>.onrender.com/api`
6. Click **Deploy**.

---

## 🔗 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/donors/register` | Register new Donor | No |
| `POST` | `/api/donors/login` | Donor Login | No |
| `POST` | `/api/receivers/register` | Register new Receiver | No |
| `POST` | `/api/receivers/login` | Receiver Login | No |
| `GET` | `/api/donations/available` | List active food donations | No |
| `POST` | `/api/donations` | Create a new food donation | Yes (Donor) |
| `POST` | `/api/requests` | Request food donation | Yes (Receiver) |
| `PUT` | `/api/requests/:id/accept` | Accept request | Yes (Donor) |
| `PUT` | `/api/requests/:id/complete` | Complete request with OTP | Yes (Donor) |
| `POST` | `/api/admin/login` | Admin login | No |
| `GET` | `/api/admin/donors` | Audit donor FSSAI statuses | Yes (Admin) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
