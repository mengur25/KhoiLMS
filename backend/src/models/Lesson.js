import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
      // Markdown formatted guide, learning objectives, notes
    },
    googleFormUrl: {
      type: String,
      default: '',
    },
    formId: {
      type: String,
      default: '',
      trim: true,
    },
    passingScore: {
      type: Number,
      default: 8,
      min: 0,
      max: 100,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    // The following sensitive content is hidden from students UNLESS they pass (score >= passingScore)
    unlockedSolution: {
      type: String,
      default: '',
      // Detailed explanation of answers, common mistakes, walkthrough
    },
    unlockedDriveLink: {
      type: String,
      default: '',
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model('Lesson', lessonSchema);
