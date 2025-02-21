import express from 'express';
import Comment from '../models/Comment.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Post a comment on a question
router.post('/question/:questionId', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const comment = new Comment({
      body: req.body.body,
      author: req.userId,
      parentId: req.params.questionId,
      parentType: 'question'
    });

    const savedComment = await comment.save();
    await savedComment.populate('author', 'username');
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Post a comment on an answer
router.post('/answer/:answerId', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const comment = new Comment({
      body: req.body.body,
      author: req.userId,
      parentId: req.params.answerId,
      parentType: 'answer'
    });

    const savedComment = await comment.save();
    
    // Add comment to answer's comments array
    answer.comments.push(savedComment._id);
    await answer.save();

    await savedComment.populate('author', 'username');
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If comment is on an answer, remove it from answer's comments array
    if (comment.parentType === 'answer') {
      await Answer.findByIdAndUpdate(comment.parentId, {
        $pull: { comments: comment._id }
      });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;