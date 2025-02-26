import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import { AlertCircle } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { Image } from "../types";

const questionSchema = z.object({
  title: z
    .string()
    .min(15, "Title must be at least 15 characters long")
    .max(150, "Title cannot exceed 150 characters"),
  body: z.string().min(30, "Question body must be at least 30 characters long"),
  tags: z
    .string()
    .transform((str) =>
      str
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
    .refine((tags) => tags.length >= 1, "At least one tag is required")
    .refine((tags) => tags.length <= 5, "Maximum 5 tags allowed")
    .refine(
      (tags) => tags.every((tag) => tag.length >= 2),
      "Each tag must be at least 2 characters long"
    ),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const AskQuestionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const createQuestion = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("tags", JSON.stringify(data.tags));
      images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[${index}]`, image.file);
        }
      });
      const response = await api.post("/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/questions/${response.data._id}`);
    } catch (error) {
      console.error("Error creating question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-4">
          You must be logged in to ask a question.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        <p className="mt-2 text-gray-600">
          Be specific and imagine you're asking a question to another
          programmer.
        </p>
      </div>

      <form onSubmit={handleSubmit(createQuestion)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="e.g. How to center a div with Tailwind CSS?"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body
            <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("body")}
            rows={10}
            placeholder="Describe your problem in detail..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="e.g. javascript,react,tailwind"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-2 text-sm text-gray-500">
            Add up to 5 tags to describe what your question is about. Separate
            tags with commas.
          </p>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
        </div>

        <ImageUpload
          images={images}
          onImagesChange={setImages}
          onRemove={(index) => setImages(images.filter((_, i) => i !== index))}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Your Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;
