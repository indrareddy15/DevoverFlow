import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/axios";
import QuestionList from "../components/QuestionList";
import { Question } from "../types";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/questions/search?q=${encodeURIComponent(query)}`
        );
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError("Error fetching search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Search results for "{query}"</h1>
      {questions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No questions found matching your search.
          </p>
        </div>
      ) : (
        <QuestionList questions={questions} />
      )}
    </div>
  );
};

export default SearchResultsPage;
