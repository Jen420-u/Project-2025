import "./styles/Home.css";
const NewsletterSignup = () => {
  return (
    <div className="newsletter-signup bg-gray-100 px-10 py-16">
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="text-lg mb-6">Subscribe to our newsletter for the latest updates and offers.</p>
      <form className="flex items-center gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 border rounded-md w-full md:w-2/3"
        />
        <button type="submit" className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
