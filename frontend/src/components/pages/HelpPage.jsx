
const HelpPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-center text-4xl font-bold text-indigo-600 mb-8">Help & Support</h1>

        {/* Introduction Section */}
        <section className="intro mb-8">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Welcome to the Help Page</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Here you can find answers to frequently asked questions, guides on how to use our website, and contact information if you need further assistance.
          </p>
        </section>

        {/* FAQs Section */}
        <section className="faqs mb-8">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Frequently Asked Questions</h2>
          <div className="faq-item mb-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-indigo-800">How do I place an order?</h4>
            <p className="text-gray-700 mt-2">
              To place an order, simply browse through our catalog, add items to your cart, and proceed to checkout.
            </p>
          </div>
          <div className="faq-item mb-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-indigo-800">What payment methods are accepted?</h4>
            <p className="text-gray-700 mt-2">
              We accept credit cards, debit cards, and other popular payment gateways like PayPal.
            </p>
          </div>
          <div className="faq-item mb-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold text-indigo-800">How can I track my order?</h4>
            <p className="text-gray-700 mt-2">
              Once your order is shipped, we will send you a tracking number via email to monitor your package&apos;s status.
            </p>
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="tutorials mb-8">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6">User Guides & Tutorials</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><a href="/how-to-order" className="text-indigo-600 hover:underline text-lg">How to Place an Order</a></li>
            <li><a href="/order-status" className="text-indigo-600 hover:underline text-lg">Check Your Order Status</a></li>
            <li><a href="/payment-options" className="text-indigo-600 hover:underline text-lg">Available Payment Options</a></li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="contact mb-8">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Contact Support</h2>
          <p className="text-lg text-gray-700 mb-2">If you have any other questions, feel free to reach out to our support team:</p>
          <p className="text-lg text-gray-700">Email: <a href="mailto:sneaksnfoot@gmail.com" className="text-indigo-600 hover:underline">sneaksnfoot@gmail.com</a></p>
          <p className="text-lg text-gray-700">Phone: <span className="font-semibold text-indigo-600">+977 9841042243</span></p>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
