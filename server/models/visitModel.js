import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
  },
  host: {
    type: String,
    required: true,
    trim: true,
  },
  entryTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  exitTime: {
    type: Date,
  },
  qrCode: {
    type: String, // Stores QR code data (e.g., URL or unique ID)
    unique: true,
  },
  documentsSigned: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
    signedAt: {
      type: Date,
      default: Date.now,
    },
    signature: {
      type: String, // Store signature data (e.g., base64 or reference to file)
      required: true,
    },
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Visit', visitSchema);