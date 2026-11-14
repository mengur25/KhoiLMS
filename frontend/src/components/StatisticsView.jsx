import React from 'react';
import {
  BarChart2,
  Trophy,
  Flame,
  CheckCircle,
  TrendingUp,
  Target,
} from 'lucide-react';

export const StatisticsView = ({ user, lessons = [], submissions = [] }) => {
  const passedCount = lessons.filter((l) => l.hasPassed).length;
  const totalLessons = lessons.length || 1;
  const progressPercent = Math.round((passedCount / totalLessons) * 100);

  const scores = submissions.map((s) => s.score);
  const avgScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : '0.0';

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Statistics &amp; Progress
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
          Thống kê kết quả học tập, chuỗi ngày liên tục và tỷ lệ đạt chuẩn 8/10
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#856b10] flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black text-gray-900">
              {passedCount} / {totalLessons}
            </div>
            <div className="text-xs font-semibold text-gray-400">
              Số ngày đạt chuẩn (&gt;= 8/10)
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black text-gray-900">
              {progressPercent}%
            </div>
            <div className="text-xs font-semibold text-gray-400">
              Tiến độ hoàn thành lộ trình
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="h-5 w-5" />
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black text-gray-900">
              {user?.streakDays || 1} ngày
            </div>
            <div className="text-xs font-semibold text-gray-400">
              Chuỗi học tập liên tục
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black text-gray-900">
              {avgScore} / 10
            </div>
            <div className="text-xs font-semibold text-gray-400">
              Điểm trung bình các lần nộp
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Detail */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-gray-900">
          Mục tiêu lộ trình kiểm tra 30 ngày
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>Tiến độ tổng thể</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#d9be55] h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Mỗi bài kiểm tra Google Form đạt tối thiểu 8/10 điểm sẽ mở khóa lời giải chi tiết và chuyển sang ngày học tiếp theo.
        </p>
      </div>
    </div>
  );
};
