import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Question } from "../types";

interface QuestionListProps {
  questions: Question[];
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  console.log("QuestionList -> questions", questions);
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question._id} className="bg-white shadow rounded-lg p-6">
          <div className="flex space-x-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="text-gray-700">
                <span className="block font-medium">{question.votes}</span>
                <span className="text-sm">votes</span>
              </div>
              <div className="text-gray-700">
                <span className="block font-medium">
                  {question.answers.length}
                </span>
                <span className="text-sm">answers</span>
              </div>
              <div className="text-gray-700">
                <span className="block font-medium">{question.views}</span>
                <span className="text-sm">views</span>
              </div>
            </div>
            <div className="flex-1">
              <Link
                to={`/questions/${question._id}`}
                className="text-xl font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {question.title}
              </Link>
              <p className="mt-2 text-gray-600 line-clamp-2">{question.body}</p>

              {question.images && question.images.length > 0 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto">
                  {question.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Question image ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
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
                  asked {format(new Date(question.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
