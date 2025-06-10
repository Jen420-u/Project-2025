import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./Footer.css";


const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            Sneaks&apos;n Foot
          </Link>
          <p>© 2025 Sneaks&apos;n Foot. All rights reserved.</p>
        </div>
        
        <div className="footer-center">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/allproduct">Shop</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contactus">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-right">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <Link to="https://www.facebook.com" target="_blank" className="social-icon">
              <FaFacebook />
            </Link>
            <Link to="https://www.instagram.com" target="_blank" className="social-icon">
              <FaInstagram />
            </Link>
            <Link to="https://www.twitter.com" target="_blank" className="social-icon">
              <FaTwitter />
            </Link>
            <Link to="https://www.linkedin.com" target="_blank" className="social-icon">
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
