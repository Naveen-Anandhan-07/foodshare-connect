import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAdmin } from "../services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await loginAdmin({
        email: email,
        password: password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem("role", "admin");

      localStorage.setItem(
        "name",
        response.data.name
      );

      toast.success("Admin login successful");

      navigate("/admin/dashboard");
    } catch (error) {
      let message = "Admin login failed";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Admin Login</h2>

        <p className="auth-subtitle">
          Login to verify donor FSSAI
          registrations.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Admin Password</label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;