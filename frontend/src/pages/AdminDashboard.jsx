import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  Users,
  BookOpen,
  Send,
  Award,
  Sparkles,
  Code,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const AdminDashboard = ({ onOpenSimulator, onOpenGuide }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getStats();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Bảng điều khiển Gia sư / Quản trị
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tiến độ học viên, kết quả nộp bài từ Google Form và quy tắc điểm 8/10
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Code className="h-3.5 w-3.5" />
            Lấy mã Apps Script
          </button>
          <button
            onClick={onOpenSimulator}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Mô phỏng nộp bài
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tổng học viên</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{stats?.stats?.totalStudents ?? 0}</span>
            <span className="text-xs text-slate-500">học viên</span>
          </div>
        </div>

        {/* Total Lessons */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Bài học / Ngày</span>
            <BookOpen className="h-4 w-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{stats?.stats?.totalLessons ?? 0}</span>
            <span className="text-xs text-slate-500">ngày học</span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Lượt nộp Form</span>
            <Send className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{stats?.stats?.totalSubmissions ?? 0}</span>
            <span className="text-xs text-slate-500">lần nộp</span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tỉ lệ đạt chuẩn (&gt;= 8)</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">{stats?.stats?.passRate ?? 0}%</span>
            <span className="text-xs text-slate-500">({stats?.stats?.passedSubmissions ?? 0} lượt đạt)</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Submissions & Google Form Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="card-clean p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                Lượt nộp bài gần nhất
              </h3>
              <p className="text-xs text-slate-500">Đánh giá chuẩn điểm 8 từ Google Form</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {stats?.recentSubmissions?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Chưa có bài nộp nào.</div>
            ) : (
              stats?.recentSubmissions?.map((sub) => (
                <div key={sub._id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-medium text-slate-900">{sub.studentId?.name || sub.studentEmail}</p>
                    <p className="text-slate-500 text-[11px]">
                      Ngày {sub.dayNumber}: {sub.lessonId?.title || sub.formId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`font-semibold ${sub.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {sub.score}/{sub.maxScore || 10}
                      </span>
                      {sub.isPassed ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          ĐẠT
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          CHƯA ĐẠT
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inbound Google Form Webhook Logs */}
        <div className="card-clean p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Send className="h-4 w-4 text-slate-500" />
                Nhật ký Webhook Google Form
              </h3>
              <p className="text-xs text-slate-500">Dữ liệu thô nhận từ Apps Script</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              POST /api/webhooks/google-form
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {stats?.recentLogs?.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Chưa nhận webhook nào.</div>
            ) : (
              stats?.recentLogs?.map((log) => (
                <div key={log._id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-mono text-slate-800 font-medium">{log.studentEmail}</p>
                    <p className="text-slate-400 text-[11px]">
                      {log.formId} • {log.formTitle || 'Google Form'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900">
                      {log.score} / {log.maxScore || 10} điểm
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
