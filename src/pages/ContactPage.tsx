
const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <form className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            type="text"
            id="name"
            name="name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            id="message"
            name="message"
            rows={4}
          ></textarea>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
      <p className="text-gray-700 mb-4">Email: contact@devoverflow.com</p>
      <p className="text-gray-700 mb-4">Phone: +1 (123) 456-7890</p>
      <p className="text-gray-700 mb-4">
        Address: 123 Developer Lane, Code City, CA 12345
      </p>
      <div className="flex space-x-4">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          Twitter
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
