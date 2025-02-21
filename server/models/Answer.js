import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    minlength: 30
  },
  images: [{
    url: String,
    publicId: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Answer', answerSchema);