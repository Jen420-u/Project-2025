const AboutUsPage = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 mb-6">
            Welcome to <span className="text-indigo-600 font-semibold">Sneak&apos;n Foot</span>, 
            your one-stop destination for premium sneakers. We are passionate about delivering 
            high-quality footwear that combines style, comfort, and durability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
              <p className="text-gray-600 mt-2">
                To provide sneaker enthusiasts with the best selection of high-quality 
                and stylish footwear at competitive prices.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Why Choose Us?</h3>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>100% Authentic Sneakers</li>
                <li>Exclusive Collections</li>
                <li>Fast & Reliable Shipping</li>
                <li>Customer-Centric Approach</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a href="/contactus" className="text-indigo-600 font-semibold hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUsPage;
  