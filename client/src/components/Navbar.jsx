import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  FaLeaf,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  const name =
    localStorage.getItem("name");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="logo"
        >
          <FaLeaf />
          FoodShare Connect
        </Link>

        <div className="nav-links">
          {!token && (
            <>
              <Link
                to="/donor/login"
                className="btn btn-outline btn-sm"
              >
                Donor Login
              </Link>

              <Link
                to="/receiver/login"
                className="btn btn-outline btn-sm"
              >
                Receiver Login
              </Link>

              <Link
                to="/admin/login"
                className="btn btn-outline btn-sm"
              >
                Admin
              </Link>

              <Link
                to="/donor/register"
                className="btn btn-primary btn-sm"
              >
                Register
              </Link>
            </>
          )}

          {token && role === "donor" && (
            <>
              <span>Hi, {name}</span>

              <Link
                to="/donor/dashboard"
                className="btn btn-outline btn-sm"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          )}

          {token && role === "receiver" && (
            <>
              <span>Hi, {name}</span>

              <Link
                to="/receiver/dashboard"
                className="btn btn-outline btn-sm"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          )}

          {token && role === "admin" && (
            <>
              <span>Hi, {name}</span>

              <Link
                to="/admin/dashboard"
                className="btn btn-outline btn-sm"
              >
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;