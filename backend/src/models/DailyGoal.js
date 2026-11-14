import mongoose from 'mongoose';

const dailyGoalSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dayNumber: {
      type: Number,
      default: 1,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

dailyGoalSchema.index({ studentId: 1, date: 1 });

export const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema);
