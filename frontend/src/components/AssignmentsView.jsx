import React from 'react';
import {
  FileCheck,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AssignmentsView = ({ submissions = [], onOpenSimulator }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Assignments &amp; Form Submissions
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
            Lịch sử các lần làm bài kiểm tra Google Form và kết quả đồng bộ tự động
          </p>
        </div>

        <button
          onClick={() => onOpenSimulator && onOpenSimulator()}
          className="px-3.5 py-2 rounded-xl bg-[#d9be55] hover:bg-[#c4aa44] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
          <span>Thử nghiệm nộp bài (Test 8/10)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Bài kiểm tra</th>
                <th className="py-3.5 px-5">Mã Form</th>
                <th className="py-3.5 px-5">Điểm số</th>
                <th className="py-3.5 px-5">Trạng thái mở khóa</th>
                <th className="py-3.5 px-5">Thời gian nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Chưa có bài nộp nào. Bạn hãy hoàn thành bài kiểm tra trên Google Form.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-5">
                      <p className="font-bold text-gray-900 text-sm">
                        Ngày {sub.dayNumber}: {sub.lessonId?.title || sub.formId}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {sub.studentEmail}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                        {sub.formId}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-extrabold text-sm text-gray-900">
                        {sub.score} / {sub.maxScore || 10} điểm
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      {sub.isPassed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                          <CheckCircle className="h-3 w-3" />
                          <span>ĐẠT CHUẨN (&gt;= 8) - Mở lời giải</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                          <AlertCircle className="h-3 w-3" />
                          <span>CHƯA ĐẠT (&lt; 8) - Bị khóa</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-gray-400 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
