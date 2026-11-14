import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    formId: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    source: {
      type: String,
      enum: ['GOOGLE_FORM_WEBHOOK', 'GOOGLE_SHEET_SYNC', 'STUDENT_CHECK', 'MANUAL_SIMULATE'],
      default: 'GOOGLE_FORM_WEBHOOK',
    },
    notes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ studentId: 1, lessonId: 1, submittedAt: -1 });
submissionSchema.index({ studentEmail: 1, formId: 1 });

export const Submission = mongoose.model('Submission', submissionSchema);
