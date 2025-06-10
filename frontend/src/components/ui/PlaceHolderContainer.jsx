import Placeholder from "./PlaceHolder" // Import the single card placeholder

const PlaceholderContainer = () => {
  return (
    <div className="placeholder-container">
      {[...Array(12)].map((_, index) => (
        <Placeholder key={index} />
      ))}
    </div>
  );
};

export default PlaceholderContainer;
