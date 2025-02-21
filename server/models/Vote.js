import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  parentType: {
    type: String,
    enum: ['question', 'answer'],
    required: true
  },
  voteType: {
    type: String,
    enum: ['up', 'down'],
    required: true
  }
}, {
  timestamps: true
});

// Ensure one vote per user per parent
voteSchema.index({ user: 1, parentId: 1, parentType: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);