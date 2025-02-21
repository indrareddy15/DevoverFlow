import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 15
  },
  body: {
    type: String,
    required: true,
    minlength: 30
  },
  images: [{
    url: String,
    publicId: String
  }],
  tags: [{
    type: String,
    required: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  votes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }]
}, {
  timestamps: true,
  strictPopulate: false
});

questionSchema.index({ title: 'text', body: 'text' });

export default mongoose.model('Question', questionSchema);