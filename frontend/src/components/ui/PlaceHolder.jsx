import './Placeholder.css'; // Optional: Add styles for the placeholder

const Placeholder = () => {
  return (
    <div className="placeholder-card">
      <div className="placeholder-image"></div>
      <div className="placeholder-details">
        <div className="placeholder-text short"></div>
        <div className="placeholder-text medium"></div>
        <div className="placeholder-text long"></div>
        <div className="placeholder-button"></div>
      </div>
    </div>
  );
};

export default Placeholder;