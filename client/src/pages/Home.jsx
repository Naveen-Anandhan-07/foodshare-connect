import { Link } from "react-router-dom";
import {
  FaHandHoldingHeart,
  FaLeaf,
  FaSearchLocation,
  FaTruck,
} from "react-icons/fa";

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Turning Surplus Food Into Shared Meals</h1>
            <p>
              FoodShare Connect links restaurants, hostels, homes, and event organizers
              with NGOs, shelters, and volunteers - so good food reaches people instead
              of the bin.
            </p>
            <div className="hero-actions">
              <Link to="/donor/register" className="btn btn-primary">
                Donate Food
              </Link>
              <Link to="/receiver/register" className="btn btn-outline">
                Find Food
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-circle">
              <FaHandHoldingHeart />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to reduce food waste.</p>
          <div className="grid grid-3">
            <div className="card step-card">
              <div className="step-number">1</div>
              <FaLeaf style={{ color: "var(--primary-green)", fontSize: "1.6rem" }} />
              <h3>Donor Posts Surplus Food</h3>
              <p>Restaurants, homes, and organizers list extra food that's ready for pickup.</p>
            </div>
            <div className="card step-card">
              <div className="step-number">2</div>
              <FaSearchLocation
                style={{ color: "var(--primary-green)", fontSize: "1.6rem" }}
              />
              <h3>Receiver Requests Food</h3>
              <p>NGOs, shelters, and volunteers browse and request available donations nearby.</p>
            </div>
            <div className="card step-card">
              <div className="step-number">3</div>
              <FaTruck style={{ color: "var(--primary-green)", fontSize: "1.6rem" }} />
              <h3>Food Is Collected &amp; Distributed</h3>
              <p>The donor confirms the request, and the food reaches those who need it.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
