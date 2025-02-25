import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();

  // Debounced search using useEffect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query, navigate]);

  return (
    <form className="relative flex-1 max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions by title or tags..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
