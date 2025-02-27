import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Question } from "../types";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/questions`
        );
        console.log("Fetched data:", data);
        setQuestions(data.questions || []);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading questions. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Top Questions</h1>
          <Link
            to="/questions/ask"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ask Question
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No questions found. Be the first to ask a question!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Top Questions</h1>
        <Link
          to="/questions/ask"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Ask Question
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        {questions.map((question) => (
          <div key={question._id} className="p-6">
            <div className="flex space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-gray-700">{question.votes} votes</span>
                <span className="text-gray-700">
                  {question.answers.length} answers
                </span>
                <span className="text-gray-700">{question.views} views</span>
              </div>
              <div className="flex-1">
                <Link
                  to={`/questions/${question._id}`}
                  className="text-xl font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {question.title}
                </Link>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${tag}`}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${question.author.username}&background=random`}
                      alt={question.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <Link
                      to={`/users/${question.author._id}`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {question.author.username}
                    </Link>
                  </div>
                  <span className="text-sm text-gray-500">
                    asked {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
