import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import ReactMarkdown from "react-markdown";
import ImageUpload from "../components/ImageUpload";

const answerSchema = z.object({
  body: z.string().min(30, "Answer must be at least 30 characters long"),
});

const commentSchema = z.object({
  body: z.string().min(5, "Comment must be at least 5 characters long"),
});

type AnswerFormData = z.infer<typeof answerSchema>;
type CommentFormData = z.infer<typeof commentSchema>;

interface Image {
  url?: string;
  file?: File;
  publicId?: string;
}

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editImages, setEditImages] = useState<Image[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [answerImages, setAnswerImages] = useState<Image[]>([]);
  const [question, setQuestion] = useState<any>(null);
  const [questionVoteStatus, setQuestionVoteStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch question and vote status
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/questions/${id}`);
        setQuestion(response.data);
      } catch (err) {
        setError("Failed to fetch question data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();

    if (user) {
      const fetchVoteStatus = async () => {
        try {
          const response = await api.get(`/votes/status/question/${id}`);
          setQuestionVoteStatus(response.data);
        } catch (err) {
          setError("Failed to fetch vote status.");
        }
      };

      fetchVoteStatus();
    }
  }, [id, user]);

  const handleQuestionUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    editImages.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    if (removedImages.length > 0) {
      formData.append("removedImages", JSON.stringify(removedImages));
    }

    try {
      await api.patch(`/questions/${id}`, formData);
      setIsEditing(false);
      setEditImages([]);
      setRemovedImages([]);
      // Refetch question
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
    } catch (err) {
      setError("Failed to update question.");
    }
  };

  const handleImageRemove = (index: number) => {
    const image = editImages[index];
    if (image.publicId) {
      setRemovedImages((prev) => [...prev, image.publicId!]);
    }
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const {
    register: registerAnswer,
    handleSubmit: handleAnswerSubmit,
    reset: resetAnswer,
    formState: { errors: answerErrors },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  });

  const handleAnswerSubmitForm = async (data: AnswerFormData) => {
    const formData = new FormData();
    formData.append("body", data.body);

    answerImages.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    try {
      await api.post(`/answers/${id}`, formData);
      // Refetch question
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
      resetAnswer();
      setAnswerImages([]);
    } catch (err) {
      setError("Failed to submit answer.");
    }
  };

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const handleSubmitCommentForm = async (data: CommentFormData) => {
    try {
      await api.post(`/comments/${id}`, data);
      // Refetch question
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
      resetComment();
    } catch (err) {
      setError("Failed to submit comment.");
    }
  };

  const handleVote = async (voteType: string) => {
    if (user) {
      try {
        await api.post(`/votes/${voteType}/question/${id}`);
        const response = await api.get(`/votes/status/question/${id}`);
        setQuestionVoteStatus(response.data);
      } catch (err) {
        setError("Failed to update vote.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Question Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The question you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        {isEditing ? (
          <form onSubmit={handleQuestionUpdate} className="space-y-4">
            <input
              type="text"
              name="title"
              defaultValue={question.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={15}
            />
            <textarea
              name="body"
              defaultValue={question.body}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={8}
              required
              minLength={30}
            />
            <input
              type="text"
              name="tags"
              defaultValue={question.tags.join(", ")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Separate tags with commas"
              required
            />
            <ImageUpload
              images={editImages}
              onImagesChange={setEditImages}
              onRemove={handleImageRemove}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-6">
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleVote("up")}
                disabled={!user}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  questionVoteStatus?.voteType === "up"
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                <ThumbsUp className="w-6 h-6" />
              </button>
              <span className="text-lg font-semibold">{question.votes}</span>
              <button
                onClick={() => handleVote("down")}
                disabled={!user}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  questionVoteStatus?.voteType === "down"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                <ThumbsDown className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {question.title}
                </h1>
                {user && user._id === question.author._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        /* Implement delete */
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="prose max-w-none mb-4">
                <ReactMarkdown>{question.body}</ReactMarkdown>
              </div>

              {question.images && question.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {question.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Question image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${question.author.username}&background=random`}
                    alt={question.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{question.author.username}</span>
                </div>
                <span>
                  asked {format(new Date(question.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Comments section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          {question.comments?.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3 mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
                alt={comment.author.username}
                className="w-6 h-6 rounded-full"
              />
              <div className="flex-1">
                <p className="text-gray-700">{comment.body}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{comment.author.username}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {user && (
            <form
              onSubmit={handleSubmitComment(handleSubmitCommentForm)}
              className="mt-4"
            >
              <div className="flex gap-2">
                <textarea
                  {...registerComment("body")}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Comment
                </button>
              </div>
              {commentErrors.body && (
                <p className="text-red-500 text-sm mt-1">
                  {commentErrors.body.message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
