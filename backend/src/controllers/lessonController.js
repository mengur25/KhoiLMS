import { Lesson } from '../models/Lesson.js';
import { Submission } from '../models/Submission.js';

export const getLessons = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'ADMIN';
    const query = isAdmin ? {} : { isPublished: true };

    const lessons = await Lesson.find(query).sort({ dayNumber: 1 }).lean();

    if (isAdmin) {
      return res.json({
        success: true,
        count: lessons.length,
        lessons: lessons.map((l) => ({ ...l, isUnlocked: true, hasPassed: true })),
      });
    }

    // Student logic: check passed status
    let userPassedDays = new Set();
    let bestScoresMap = {};

    if (req.user) {
      const submissions = await Submission.find({ studentId: req.user._id }).lean();
      for (const sub of submissions) {
        if (!bestScoresMap[sub.lessonId.toString()] || sub.score > bestScoresMap[sub.lessonId.toString()]) {
          bestScoresMap[sub.lessonId.toString()] = sub.score;
        }
        if (sub.isPassed) {
          userPassedDays.add(sub.lessonId.toString());
        }
      }
    }

    // Process lessons: Day 1 is always unlocked to study, subsequent days unlock after previous is passed
    const processed = lessons.map((lesson, index) => {
      const hasPassed = userPassedDays.has(lesson._id.toString());
      const bestScore = bestScoresMap[lesson._id.toString()] ?? null;

      // Access to learning material: Day 1 is open, Day N is accessible if Day N-1 is passed or if user is tutor
      const previousLesson = index > 0 ? lessons[index - 1] : null;
      const canAccessLesson = index === 0 || (previousLesson && userPassedDays.has(previousLesson._id.toString()));

      return {
        _id: lesson._id,
        dayNumber: lesson.dayNumber,
        title: lesson.title,
        description: lesson.description,
        content: canAccessLesson ? lesson.content : 'Nội dung ngày học này đang bị khóa. Hãy hoàn thành bài tập ngày trước với điểm số >= 8 để mở khóa!',
        googleFormUrl: canAccessLesson ? lesson.googleFormUrl : '',
        formId: lesson.formId,
        passingScore: lesson.passingScore,
        maxScore: lesson.maxScore,
        resources: canAccessLesson ? lesson.resources : [],
        isLocked: !canAccessLesson,
        hasPassed,
        bestScore,
        // The 8/10 Rule: detailed solution and master drive are ONLY visible if student has passed (score >= 8)
        unlockedSolution: hasPassed ? lesson.unlockedSolution : null,
        unlockedDriveLink: hasPassed ? lesson.unlockedDriveLink : null,
        solutionLocked: !hasPassed,
        createdAt: lesson.createdAt,
      };
    });

    return res.json({
      success: true,
      count: processed.length,
      lessons: processed,
    });
  } catch (err) {
    console.error('getLessons error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách bài học: ' + err.message,
    });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).lean();

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học.',
      });
    }

    const isAdmin = req.user && req.user.role === 'ADMIN';
    if (isAdmin) {
      return res.json({
        success: true,
        lesson: { ...lesson, hasPassed: true, solutionLocked: false },
      });
    }

    let hasPassed = false;
    let bestScore = null;
    let submissions = [];

    if (req.user) {
      submissions = await Submission.find({
        studentId: req.user._id,
        lessonId: lesson._id,
      })
        .sort({ submittedAt: -1 })
        .lean();

      if (submissions.length > 0) {
        bestScore = Math.max(...submissions.map((s) => s.score));
        hasPassed = submissions.some((s) => s.isPassed);
      }
    }

    return res.json({
      success: true,
      lesson: {
        _id: lesson._id,
        dayNumber: lesson.dayNumber,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        googleFormUrl: lesson.googleFormUrl,
        formId: lesson.formId,
        passingScore: lesson.passingScore,
        maxScore: lesson.maxScore,
        resources: lesson.resources,
        hasPassed,
        bestScore,
        recentSubmissions: submissions,
        // Hidden unless passed
        unlockedSolution: hasPassed ? lesson.unlockedSolution : null,
        unlockedDriveLink: hasPassed ? lesson.unlockedDriveLink : null,
        solutionLocked: !hasPassed,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải bài học: ' + err.message,
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const {
      dayNumber,
      title,
      description,
      content,
      googleFormUrl,
      formId,
      passingScore,
      maxScore,
      unlockedSolution,
      unlockedDriveLink,
      resources,
      isPublished,
    } = req.body;

    if (!dayNumber || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Ngày (dayNumber), Tiêu đề và Nội dung bài học.',
      });
    }

    const existing = await Lesson.findOne({ dayNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Ngày số ${dayNumber} đã tồn tại trong giáo trình!`,
      });
    }

    const lesson = await Lesson.create({
      dayNumber,
      title,
      description: description || '',
      content,
      googleFormUrl: googleFormUrl || '',
      formId: formId || `DAY_${dayNumber}_FORM`,
      passingScore: passingScore !== undefined ? Number(passingScore) : 8,
      maxScore: maxScore !== undefined ? Number(maxScore) : 10,
      unlockedSolution: unlockedSolution || '',
      unlockedDriveLink: unlockedDriveLink || '',
      resources: resources || [],
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    return res.status(201).json({
      success: true,
      message: `Tạo bài học Ngày ${dayNumber} thành công!`,
      lesson,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tạo bài học: ' + err.message,
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Lesson.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học để cập nhật.',
      });
    }

    return res.json({
      success: true,
      message: 'Cập nhật bài học thành công!',
      lesson: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật bài học: ' + err.message,
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lesson.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học để xóa.',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa bài học thành công.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xóa bài học: ' + err.message,
    });
  }
};
