import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Lock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const CertificatesView = ({ lessons = [], onSelectLesson }) => {
  const passedLessons = lessons.filter((l) => l.hasPassed);
  const lockedLessons = lessons.filter((l) => !l.hasPassed);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My Certificates &amp; Unlocked Solutions
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
          Kho lời giải chi tiết và phân tích đáp án độc quyền (Được mở khóa khi điểm &gt;= 8/10)
        </p>
      </div>

      {passedLessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#856b10] flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">
            Chưa có lời giải nào được mở khóa
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Hãy hoàn thành bài kiểm tra Google Form và đạt từ 8/10 điểm trở lên để hệ thống tự động mở khóa lời giải chi tiết tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {passedLessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  Ngày {lesson.dayNumber} &bull; Đã đạt ({lesson.bestScore}/10)
                </span>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>

              <h3 className="font-extrabold text-base text-gray-900">
                {lesson.title}
              </h3>

              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {lesson.unlockedSolution || 'Nội dung lời giải chi tiết độc quyền.'}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                {lesson.unlockedDriveLink ? (
                  <a
                    href={lesson.unlockedDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Link Drive bài giải</span>
                  </a>
                ) : (
                  <span className="text-gray-400">Không có file đính kèm</span>
                )}

                <button
                  onClick={() => onSelectLesson && onSelectLesson(lesson)}
                  className="px-3 py-1.5 rounded-lg bg-[#d9be55] hover:bg-[#c4aa44] text-white font-bold transition"
                >
                  Xem toàn màn hình
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
