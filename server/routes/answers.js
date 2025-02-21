import express from 'express';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import { auth } from '../middleware/auth.js';
import { upload, deleteImage } from '../config/cloudinary.js';

const router = express.Router();

// Get all answers for a question
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      })
      .sort({ isAccepted: -1, votes: -1, createdAt: -1 });
    
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post an answer
router.post('/:questionId', auth, upload.array('images', 5), async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const images = req.files?.map(file => ({
      url: file.path,
      publicId: file.filename
    })) || [];

    const answer = new Answer({
      body: req.body.body,
      images,
      author: req.userId,
      question: req.params.questionId
    });

    const savedAnswer = await answer.save();
    
    question.answers.push(savedAnswer._id);
    await question.save();

    await savedAnswer.populate('author', 'username');
    res.status(201).json(savedAnswer);
  } catch (err) {
    if (req.files) {
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: err.message });
  }
});

// Edit an answer
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    if (answer.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { body, removedImages } = req.body;

    // Handle removed images
    if (removedImages) {
      const removedImageIds = JSON.parse(removedImages);
      for (const imageId of removedImageIds) {
        const image = answer.images.find(img => img.publicId === imageId);
        if (image) {
          await deleteImage(image.publicId);
        }
      }
      answer.images = answer.images.filter(img => !removedImageIds.includes(img.publicId));
    }

    // Add new images
    if (req.files?.length) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      answer.images.push(...newImages);
    }

    answer.body = body;
    await answer.save();
    
    await answer.populate('author', 'username');
    res.json(answer);
  } catch (err) {
    if (req.files) {
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: err.message });
  }
});

// Delete an answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    if (answer.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated images from Cloudinary
    for (const image of answer.images) {
      await deleteImage(image.publicId);
    }

    // Remove answer from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    await answer.deleteOne();
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;