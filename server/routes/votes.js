import express from 'express';
import Vote from '../models/Vote.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Vote on a question
router.post('/question/:questionId', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user has already voted
    let vote = await Vote.findOne({
      user: req.userId,
      parentId: req.params.questionId,
      parentType: 'question'
    });

    if (vote) {
      // If vote type is different, update it and adjust question votes
      if (vote.voteType !== voteType) {
        const voteDiff = voteType === 'up' ? 2 : -2; // +2 for up, -2 for down (reversing previous vote)
        question.votes += voteDiff;
        vote.voteType = voteType;
        await vote.save();
      }
    } else {
      // Create new vote
      vote = new Vote({
        user: req.userId,
        parentId: req.params.questionId,
        parentType: 'question',
        voteType
      });
      await vote.save();
      
      question.votes += voteType === 'up' ? 1 : -1;
    }

    await question.save();
    res.json({ votes: question.votes, voteType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote on an answer
router.post('/answer/:answerId', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const answer = await Answer.findById(req.params.answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    let vote = await Vote.findOne({
      user: req.userId,
      parentId: req.params.answerId,
      parentType: 'answer'
    });

    if (vote) {
      if (vote.voteType !== voteType) {
        const voteDiff = voteType === 'up' ? 2 : -2;
        answer.votes += voteDiff;
        vote.voteType = voteType;
        await vote.save();
      }
    } else {
      vote = new Vote({
        user: req.userId,
        parentId: req.params.answerId,
        parentType: 'answer',
        voteType
      });
      await vote.save();
      
      answer.votes += voteType === 'up' ? 1 : -1;
    }

    await answer.save();
    res.json({ votes: answer.votes, voteType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get vote status for a question
router.get('/status/question/:questionId', auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user: req.userId,
      parentId: req.params.questionId,
      parentType: 'question'
    });
    
    res.json({ voteType: vote?.voteType || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vote status for an answer
router.get('/status/answer/:answerId', auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user: req.userId,
      parentId: req.params.answerId,
      parentType: 'answer'
    });
    
    res.json({ voteType: vote?.voteType || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;