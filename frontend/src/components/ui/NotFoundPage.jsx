import { Link } from "react-router-dom";
import "./NotFoundPage.css"; // Create a CSS file for custom styling

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="notfound-btn">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
