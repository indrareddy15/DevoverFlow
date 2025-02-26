const CareersPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Careers</h1>
      <p className="text-gray-700 mb-4">
        Join our team and help us build the best Q&A platform for developers.
        Check out our open positions and apply today!
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Open Positions
        </h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-xl font-semibold text-gray-900">
              Frontend Developer
            </h3>
            <p className="text-gray-700">
              We are looking for a skilled frontend developer with experience in
              React and Tailwind CSS.
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Apply Now
            </button>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-gray-900">
              Backend Developer
            </h3>
            <p className="text-gray-700">
              We are seeking a backend developer with expertise in Node.js and
              MongoDB.
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Apply Now
            </button>
          </li>
        </ul>
      </div>
      <p className="text-gray-700 mb-4">
        At DevOverflow, we value our employees and offer a range of benefits,
        including flexible working hours, remote work options, and professional
        development opportunities.
      </p>
      <p className="text-gray-700 mb-4">
        Learn more about our company culture and connect with us on{" "}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700"
        >
          LinkedIn
        </a>
        .
      </p>
    </div>
  );
};

export default CareersPage;
