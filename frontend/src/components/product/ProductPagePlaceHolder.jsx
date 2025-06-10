
const PagePlaceholder = () => {
  return (
    <div className="product-placeholder-container">
      <div className="product-placeholder-card">
        <div className="placeholder-image bg-gray-300 animate-pulse"></div>
        <div className="placeholder-text">
          <div className="placeholder-title bg-gray-300 animate-pulse"></div>
          <div className="placeholder-description bg-gray-300 animate-pulse"></div>
          <div className="placeholder-price bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PagePlaceholder;
