import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
        <p className="text-gray-600 mb-6 text-center">
          Have any questions or need support? Reach out to us and we’ll be happy to assist you!
        </p>
        
        {/* Contact Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Your Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              rows="4"
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <FaPhone className="text-blue-600" /> <span className="font-semibold">+1 234 567 890</span>
          </p>
          <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
            <FaEnvelope className="text-red-500" /> <span className="font-semibold">support@sneaknfoot.com</span>
          </p>
        </div>

        {/* Social Media Links */}
        <div className="mt-6 flex justify-center space-x-6">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition text-2xl">
            <FaFacebook />
          </a>
          <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition text-2xl">
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition text-2xl">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition text-2xl">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
