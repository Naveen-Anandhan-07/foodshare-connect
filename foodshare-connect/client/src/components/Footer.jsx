import { FaLeaf } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <FaLeaf /> <strong>FoodShare Connect</strong>
      </div>
      <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem" }}>
        Connecting surplus food with people who need it — reducing waste, one meal at a time.
      </p>
      <p style={{ margin: "10px 0 0 0", fontSize: "0.8rem" }}>
        &copy; {new Date().getFullYear()} FoodShare Connect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
