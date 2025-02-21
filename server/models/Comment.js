import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    minlength: 5
  },
  author: {
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
  }
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);