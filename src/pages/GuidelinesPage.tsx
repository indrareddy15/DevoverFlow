
const GuidelinesPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Community Guidelines
      </h1>
      <p className="text-gray-700 mb-4">
        Welcome to DevOverflow! To ensure a positive and respectful environment
        for all members, please follow our community guidelines.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Policy</h2>
      <p className="text-gray-700 mb-4">
        We encourage the sharing of knowledge and constructive discussions.
        However, the following content is prohibited:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Hate speech or discriminatory content</li>
        <li>Spam or irrelevant content</li>
        <li>Harassment or abusive behavior</li>
      </ul>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Safety and Security Tips
      </h2>
      <p className="text-gray-700 mb-4">
        Protect your personal information and be cautious when interacting with
        others online. Report any suspicious activity to our support team.
      </p>
    </div>
  );
};

export default GuidelinesPage;
