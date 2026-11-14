import { User } from '../models/User.js';
import { Lesson } from '../models/Lesson.js';
import { Submission } from '../models/Submission.js';
import { GoogleFormLog } from '../models/GoogleFormLog.js';
import { DailyGoal } from '../models/DailyGoal.js';
import { getGoogleAppsScriptCode } from '../utils/googleAppsScriptTemplate.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalLessons = await Lesson.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const passedSubmissions = await Submission.countDocuments({ isPassed: true });

    const passRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;

    const recentSubmissions = await Submission.find()
      .populate('studentId', 'name email avatar')
      .populate('lessonId', 'title dayNumber passingScore')
      .sort({ submittedAt: -1 })
      .limit(10);

    const recentLogs = await GoogleFormLog.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalLessons,
        totalSubmissions,
        passedSubmissions,
        passRate,
      },
      recentSubmissions,
      recentLogs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải thống kê quản trị: ' + err.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' }).select('-passwordHash').sort({ createdAt: -1 }).lean();
    const totalLessons = await Lesson.countDocuments();

    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        // Find passed submissions
        const passedSubs = await Submission.find({
          studentId: student._id,
          isPassed: true,
        }).lean();

        // Unique passed lesson IDs
        const uniquePassedLessons = new Set(passedSubs.map((s) => s.lessonId?.toString()).filter(Boolean));
        const passedCount = uniquePassedLessons.size;
        const progressPercentage = totalLessons > 0 ? Math.round((passedCount / totalLessons) * 100) : 0;

        // Latest submission
        const latestSub = await Submission.findOne({ studentId: student._id })
          .populate('lessonId', 'title dayNumber')
          .sort({ submittedAt: -1 })
          .lean();

        return {
          ...student,
          passedLessonsCount: passedCount,
          totalLessons,
          progressPercentage,
          latestSubmission: latestSub || null,
        };
      })
    );

    return res.json({
      success: true,
      count: studentsWithProgress.length,
      students: studentsWithProgress,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách học viên: ' + err.message,
    });
  }
};

export const getIntegrationGuide = async (req, res) => {
  const host = req.get('host') || 'localhost:5001';
  const protocol = req.protocol || 'http';
  const webhookUrl = `${protocol}://${host}/api/webhooks/google-form`;

  const scriptCode = getGoogleAppsScriptCode(webhookUrl);

  return res.json({
    success: true,
    webhookUrl,
    scriptCode,
    instructions: [
      '1. Mở bài trắc nghiệm Google Form cần liên kết',
      '2. Vào menu 3 chấm góc phải -> Trình chỉnh sửa tập lệnh (Apps Script)',
      '3. Sao chép và dán toàn bộ đoạn code Apps Script bên dưới',
      '4. Đổi biến FORM_ID (ví dụ: DAY_1_FORM) tương ứng với mã Form trong LMS',
      '5. Tạo Bộ kích hoạt (Trigger) loại "Khi gửi biểu mẫu" (On form submit)',
      '6. Khi học viên nộp bài, Google Form sẽ tự động đẩy điểm và email về LMS để tính chuẩn >= 8/10!',
    ],
  });
};
