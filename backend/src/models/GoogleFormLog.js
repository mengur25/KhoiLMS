import mongoose from 'mongoose';

const googleFormLogSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    formTitle: {
      type: String,
      default: '',
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    processed: {
      type: Boolean,
      default: false,
    },
    matchedSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
  },
  {
    timestamps: true,
  }
);

googleFormLogSchema.index({ studentEmail: 1, formId: 1, createdAt: -1 });

export const GoogleFormLog = mongoose.model('GoogleFormLog', googleFormLogSchema);
