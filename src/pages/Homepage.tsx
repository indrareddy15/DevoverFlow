import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bot, BarChart, Cpu } from "lucide-react";

const aiModels = [
  { name: "GPT-4 Turbo", version: "4.0", responseTime: "120ms" },
  { name: "Claude 3", version: "3.0", responseTime: "98ms" },
  { name: "Gemini Ultra", version: "1.5", responseTime: "110ms" },
];

const HomePage = () => {
  const [models, setModels] = useState(aiModels);

  useEffect(() => {
    const interval = setInterval(() => {
      setModels((prevModels) =>
        prevModels.map((model) => ({
          ...model,
          responseTime: `${Math.floor(Math.random() * 100) + 90}ms`,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?technology,ai')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to Dev Overflow
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Your go-to platform for doubt clarification and knowledge sharing.
          </p>
          <Link
            to="/questions/ask"
            className="mt-6 inline-block px-6 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
          >
            Ask Question
          </Link>
        </div>
      </section>

      {/* Real-Time AI Models */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
          <Cpu className="w-8 h-8 text-blue-400" /> Top AI Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center"
            >
              <BarChart className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white">{model.name}</h3>
              <p className="text-gray-400">Version: {model.version}</p>
              <p className="text-gray-300 flex items-center gap-2">
                <Bot className="w-5 h-5 text-yellow-400" /> Response Time:{" "}
                {model.responseTime}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
