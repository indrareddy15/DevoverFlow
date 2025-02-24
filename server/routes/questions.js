import express from "express";
import Question from "../models/Question.js";
import { auth } from "../middleware/auth.js";
import { upload, deleteImage } from "../config/cloudinary.js";

const router = express.Router();

// Search questions
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(q, "i");
    const questions = await Question.find({
      $or: [
        { title: searchRegex },
        { body: searchRegex },
        { tags: searchRegex },
      ],
    })
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific question
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: [
          { path: "author", select: "username" },
          {
            path: "comments",
            populate: { path: "author", select: "username" },
          },
        ],
      })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.views += 1;
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a question
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  const { title, body, tags } = req.body;
  console.log("Create a question", req.files);

  try {
    const images =
      req.files?.map((file) => ({
        url: file.path, // Cloudinary URL
        publicId: file.filename, // Public ID of the image in Cloudinary
      })) || [];

    const question = new Question({
      title,
      body,
      tags: JSON.parse(tags),
      images,
      author: req.userId, // Assuming you have user authentication
    });

    await question.save();
    await question.populate("author", "username");
    res.status(201).json(question);
  } catch (err) {
    if (req.files) {
      // Clean up by deleting uploaded images if error occurs
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: `Error from Route: ${err.message}` });
  }
});

// Update a question
router.patch("/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, body, tags, removedImages } = req.body;

    // Handle removed images
    if (removedImages) {
      const removedImageIds = JSON.parse(removedImages);
      for (const imageId of removedImageIds) {
        const image = question.images.find((img) => img.publicId === imageId);
        if (image) {
          await deleteImage(image.publicId); // Remove image from Cloudinary
        }
      }
      question.images = question.images.filter(
        (img) => !removedImageIds.includes(img.publicId)
      );
    }

    // Add new images
    if (req.files?.length) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
      question.images.push(...newImages);
    }

    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = JSON.parse(tags);

    await question.save();
    await question.populate("author", "username");
    res.json(question);
  } catch (err) {
    if (req.files) {
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: err.message });
  }
});

// Delete a question
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated images from Cloudinary
    for (const image of question.images) {
      await deleteImage(image.publicId);
    }

    await question.deleteOne();
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
