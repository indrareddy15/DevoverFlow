
const HelpCenterPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
      <input
        type="text"
        placeholder="Search for help articles..."
        className="w-full px-3 py-2 border rounded mb-8"
      />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-xl font-semibold text-gray-900">
              Account Management
            </h3>
            <p className="text-gray-700">
              Learn how to manage your account settings and preferences.
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-gray-900">Billing</h3>
            <p className="text-gray-700">
              Get help with billing and payment issues.
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-gray-900">Features</h3>
            <p className="text-gray-700">
              Discover how to use our platform's features effectively.
            </p>
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions (FAQs)
        </h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-xl font-semibold text-gray-900">
              How do I reset my password?
            </h3>
            <p className="text-gray-700">
              To reset your password, go to the account settings page and click
              on "Reset Password".
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-gray-900">
              How do I delete my account?
            </h3>
            <p className="text-gray-700">
              To delete your account, please contact our support team at
              support@devoverflow.com.
            </p>
          </li>
        </ul>
      </div>
      <p className="text-gray-700 mb-4">
        If you need further assistance, please contact our support team at
        support@devoverflow.com.
      </p>
    </div>
  );
};

export default HelpCenterPage;
