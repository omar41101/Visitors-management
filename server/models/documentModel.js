import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String, // Could store HTML, markdown, or file reference
    required: true,
  },
  type: {
    type: String,
    enum: ['safety', 'policy', 'other'],
    required: true,
  },
  version: {
    type: String,
    required: true,
    default: '1.0',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Document', documentSchema);