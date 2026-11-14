import { DailyGoal } from '../models/DailyGoal.js';

export const getGoals = async (req, res) => {
  try {
    const studentId = req.user._id;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    let goals = await DailyGoal.find({ studentId, date }).sort({ createdAt: 1 });

    // If no goals exist for today yet, create default goal checklist
    if (goals.length === 0) {
      const defaultGoals = [
        {
          studentId,
          title: 'Đọc lý thuyết và ghi chú các khái niệm cốt lõi',
          date,
          dayNumber: 1,
          isCompleted: false,
        },
        {
          studentId,
          title: 'Làm bài tập trắc nghiệm trên Google Form',
          date,
          dayNumber: 1,
          isCompleted: false,
        },
        {
          studentId,
          title: 'Đạt điểm >= 8/10 để mở khóa lời giải chi tiết',
          date,
          dayNumber: 1,
          isCompleted: false,
        },
      ];
      goals = await DailyGoal.insertMany(defaultGoals);
    }

    return res.json({
      success: true,
      date,
      goals,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải mục tiêu ngày: ' + err.message,
    });
  }
};

export const toggleGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await DailyGoal.findOne({ _id: id, studentId: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu.',
      });
    }

    goal.isCompleted = !goal.isCompleted;
    goal.completedAt = goal.isCompleted ? new Date() : null;
    await goal.save();

    return res.json({
      success: true,
      message: goal.isCompleted ? 'Đã hoàn thành mục tiêu!' : 'Đã bỏ tích hoàn thành.',
      goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật mục tiêu: ' + err.message,
    });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, date, dayNumber } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập nội dung mục tiêu.',
      });
    }

    const todayStr = date || new Date().toISOString().split('T')[0];
    const goal = await DailyGoal.create({
      studentId: req.user._id,
      title: title.trim(),
      date: todayStr,
      dayNumber: dayNumber || 1,
      isCompleted: false,
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm mục tiêu thành công!',
      goal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tạo mục tiêu: ' + err.message,
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DailyGoal.findOneAndDelete({ _id: id, studentId: req.user._id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu để xóa.',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa mục tiêu thành công.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xóa mục tiêu: ' + err.message,
    });
  }
};
