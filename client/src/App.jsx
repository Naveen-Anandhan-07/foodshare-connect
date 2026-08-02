import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import ReceiverLogin from "./pages/ReceiverLogin";
import ReceiverRegister from "./pages/ReceiverRegister";
import DonorDashboard from "./pages/DonorDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import AddDonation from "./pages/AddDonation";
import EditDonation from "./pages/EditDonation";
import MyRequests from "./pages/MyRequests";
import DonorRequests from "./pages/DonorRequests";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/donor/login"
          element={<DonorLogin />}
        />

        <Route
          path="/donor/register"
          element={<DonorRegister />}
        />

        <Route
          path="/receiver/login"
          element={<ReceiverLogin />}
        />

        <Route
          path="/receiver/register"
          element={<ReceiverRegister />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/add-donation"
          element={
            <ProtectedRoute allowedRole="donor">
              <AddDonation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/edit-donation/:id"
          element={
            <ProtectedRoute allowedRole="donor">
              <EditDonation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/requests"
          element={
            <ProtectedRoute allowedRole="donor">
              <DonorRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receiver/dashboard"
          element={
            <ProtectedRoute allowedRole="receiver">
              <ReceiverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receiver/my-requests"
          element={
            <ProtectedRoute allowedRole="receiver">
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
