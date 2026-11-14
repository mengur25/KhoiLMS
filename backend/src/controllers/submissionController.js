import { Submission } from '../models/Submission.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { DailyGoal } from '../models/DailyGoal.js';
import { GoogleFormLog } from '../models/GoogleFormLog.js';

// Helper to parse scores from various Google Form score formats ("8 / 10", "8/10", "8.5", "85%")
const parseScoreAndMax = (scoreInput, maxScoreInput) => {
  let score = 0;
  let max = Number(maxScoreInput) || 10;

  if (typeof scoreInput === 'number') {
    score = scoreInput;
  } else if (typeof scoreInput === 'string') {
    const trimmed = scoreInput.trim();
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      score = parseFloat(parts[0]);
      max = parseFloat(parts[1]) || max;
    } else if (trimmed.includes('%')) {
      const pct = parseFloat(trimmed);
      score = (pct / 100) * max;
    } else {
      score = parseFloat(trimmed) || 0;
    }
  }

  // Normalize if score was given in 100-scale and max was 10
  if (score > 10 && max === 10) {
    score = score / 10;
  }

  return { score: Math.round(score * 10) / 10, maxScore: max };
};

/**
 * WEBHOOK: Received automatically from Google Forms via Google Apps Script (onFormSubmit)
 */
export const handleGoogleFormWebhook = async (req, res) => {
  try {
    const { studentEmail, email, formId, formTitle, score: rawScore, maxScore: rawMax, secret, answers } = req.body;

    const inputEmail = (studentEmail || email || '').toLowerCase().trim();
    if (!inputEmail) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu email học viên từ Google Form.',
      });
    }

    const { score, maxScore } = parseScoreAndMax(rawScore, rawMax);

    // Save inbound raw log
    const formLog = await GoogleFormLog.create({
      formId: formId || 'UNKNOWN_FORM',
      studentEmail: inputEmail,
      score,
      maxScore,
      formTitle: formTitle || '',
      rawPayload: req.body,
    });

    // Find student in LMS
    const student = await User.findOne({ email: inputEmail });
    if (!student) {
      return res.status(200).json({
        success: true,
        message: `Đã ghi nhận kết quả Google Form cho email ${inputEmail}. Chưa có tài khoản học viên đăng ký trên LMS.`,
        score,
        isPassed: score >= 8,
      });
    }

    // Find lesson associated with this formId or formTitle or active lesson
    let lesson = null;
    if (formId) {
      lesson = await Lesson.findOne({ formId: formId.trim() });
    }
    if (!lesson && formTitle) {
      lesson = await Lesson.findOne({ title: new RegExp(formTitle.trim(), 'i') });
    }
    if (!lesson) {
      // Default to first open lesson or Day 1 if no match
      lesson = await Lesson.findOne().sort({ dayNumber: 1 });
    }

    const passingScore = lesson ? lesson.passingScore : 8;
    const isPassed = score >= passingScore;

    // Create or record Submission
    const submission = await Submission.create({
      studentId: student._id,
      studentEmail: inputEmail,
      lessonId: lesson ? lesson._id : null,
      dayNumber: lesson ? lesson.dayNumber : 1,
      formId: formId || (lesson ? lesson.formId : ''),
      score,
      maxScore,
      isPassed,
      source: 'GOOGLE_FORM_WEBHOOK',
      notes: `Nhận tự động từ Google Form (${formTitle || 'Bài kiểm tra'})`,
    });

    formLog.processed = true;
    formLog.matchedSubmissionId = submission._id;
    await formLog.save();

    // If passed (score >= 8):
    if (isPassed && lesson) {
      // 1. Update student's daily goal for this lesson
      const todayStr = new Date().toISOString().split('T')[0];
      await DailyGoal.findOneAndUpdate(
        {
          studentId: student._id,
          $or: [{ dayNumber: lesson.dayNumber }, { date: todayStr }],
        },
        {
          isCompleted: true,
          completedAt: new Date(),
        }
      );

      // 2. Increment streak
      student.streakDays = (student.streakDays || 0) + 1;
      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: isPassed
        ? `🎉 Chúc mừng! Điểm số ${score}/${maxScore} >= ${passingScore}. Đã mở khóa lời giải chi tiết và hoàn thành ngày học!`
        : `Điểm số ${score}/${maxScore} chưa đạt điểm chuẩn ${passingScore}/10. Hãy xem lại kiến thức và thử lại!`,
      score,
      maxScore,
      passingScore,
      isPassed,
      submissionId: submission._id,
    });
  } catch (err) {
    console.error('Google Form Webhook Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý webhook Google Form: ' + err.message,
    });
  }
};

/**
 * STUDENT CHECK: Check latest Google Form score for a lesson
 */
export const checkGoogleFormStatus = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const student = req.user;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học.',
      });
    }

    // Look for recent Google Form submissions for this student email and formId
    const latestLog = await GoogleFormLog.findOne({
      studentEmail: student.email,
      $or: [{ formId: lesson.formId }, { formId: { $exists: true } }],
    }).sort({ createdAt: -1 });

    if (!latestLog) {
      return res.json({
        success: true,
        found: false,
        message: `Chưa tìm thấy kết quả nộp bài trên Google Form cho email "${student.email}". Sau khi bấm gửi biểu mẫu trên Google Form, vui lòng đợi vài giây và bấm kiểm tra lại!`,
      });
    }

    const isPassed = latestLog.score >= lesson.passingScore;

    // Ensure a submission record exists
    let submission = await Submission.findOne({
      studentId: student._id,
      lessonId: lesson._id,
      score: latestLog.score,
    });

    if (!submission) {
      submission = await Submission.create({
        studentId: student._id,
        studentEmail: student.email,
        lessonId: lesson._id,
        dayNumber: lesson.dayNumber,
        formId: lesson.formId,
        score: latestLog.score,
        maxScore: latestLog.maxScore,
        isPassed,
        source: 'GOOGLE_FORM_WEBHOOK',
      });
    }

    if (isPassed) {
      const todayStr = new Date().toISOString().split('T')[0];
      await DailyGoal.findOneAndUpdate(
        { studentId: student._id, date: todayStr },
        { isCompleted: true, completedAt: new Date() }
      );
    }

    return res.json({
      success: true,
      found: true,
      score: latestLog.score,
      maxScore: latestLog.maxScore,
      passingScore: lesson.passingScore,
      isPassed,
      message: isPassed
        ? `🎉 Điểm Google Form của bạn là ${latestLog.score}/${latestLog.maxScore} (ĐẠT >= ${lesson.passingScore}). Lời giải chi tiết đã được mở khóa!`
        : `Điểm Google Form của bạn là ${latestLog.score}/${latestLog.maxScore} (Chưa đạt mức ${lesson.passingScore}/10). Hãy ôn tập và làm lại bài trên form!`,
      unlockedSolution: isPassed ? lesson.unlockedSolution : null,
      unlockedDriveLink: isPassed ? lesson.unlockedDriveLink : null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra điểm Google Form: ' + err.message,
    });
  }
};

/**
 * SIMULATE GOOGLE FORM SUBMISSION (Testing & Demo tool)
 * Allows tutor or student to simulate a Google Form submission directly to test the 8/10 rule
 */
export const simulateGoogleFormSubmit = async (req, res) => {
  try {
    const { lessonId, score: rawScore, studentEmail, notes } = req.body;
    const emailToUse = (studentEmail || req.user.email).toLowerCase().trim();

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học.',
      });
    }

    const { score, maxScore } = parseScoreAndMax(rawScore, lesson.maxScore || 10);
    const isPassed = score >= lesson.passingScore;

    const student = await User.findOne({ email: emailToUse }) || req.user;

    const submission = await Submission.create({
      studentId: student._id,
      studentEmail: emailToUse,
      lessonId: lesson._id,
      dayNumber: lesson.dayNumber,
      formId: lesson.formId || `DAY_${lesson.dayNumber}_FORM`,
      score,
      maxScore,
      isPassed,
      source: 'MANUAL_SIMULATE',
      notes: notes || 'Mô phỏng nộp bài Google Form để kiểm tra logic',
    });

    // Also register in GoogleFormLog so sync sees it
    await GoogleFormLog.create({
      formId: lesson.formId || `DAY_${lesson.dayNumber}_FORM`,
      studentEmail: emailToUse,
      score,
      maxScore,
      formTitle: `Bài kiểm tra Ngày ${lesson.dayNumber}`,
      processed: true,
      matchedSubmissionId: submission._id,
    });

    if (isPassed) {
      const todayStr = new Date().toISOString().split('T')[0];
      await DailyGoal.findOneAndUpdate(
        { studentId: student._id, date: todayStr },
        { isCompleted: true, completedAt: new Date() }
      );
      student.streakDays = (student.streakDays || 0) + 1;
      await student.save();
    }

    return res.json({
      success: true,
      isPassed,
      score,
      maxScore,
      passingScore: lesson.passingScore,
      message: isPassed
        ? `🎉 Điểm số ${score}/${maxScore} >= ${lesson.passingScore}! Đã mở khóa lời giải chi tiết cho Ngày ${lesson.dayNumber}!`
        : `Điểm số ${score}/${maxScore} < ${lesson.passingScore}. Chưa đủ điểm mở khóa lời giải.`,
      submission,
      unlockedSolution: isPassed ? lesson.unlockedSolution : null,
      unlockedDriveLink: isPassed ? lesson.unlockedDriveLink : null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi mô phỏng nộp bài: ' + err.message,
    });
  }
};

/**
 * Get submissions of current logged-in student
 */
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('lessonId', 'title dayNumber passingScore')
      .sort({ submittedAt: -1 });

    return res.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải lịch sử bài nộp: ' + err.message,
    });
  }
};

/**
 * Get all submissions (Admin only)
 */
export const getAllSubmissions = async (req, res) => {
  try {
    const { dayNumber, studentEmail, isPassed } = req.query;
    const filter = {};

    if (dayNumber) filter.dayNumber = Number(dayNumber);
    if (studentEmail) filter.studentEmail = new RegExp(studentEmail.trim(), 'i');
    if (isPassed !== undefined) filter.isPassed = isPassed === 'true';

    const submissions = await Submission.find(filter)
      .populate('studentId', 'name email avatar')
      .populate('lessonId', 'title dayNumber passingScore')
      .sort({ submittedAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách nộp bài: ' + err.message,
    });
  }
};
