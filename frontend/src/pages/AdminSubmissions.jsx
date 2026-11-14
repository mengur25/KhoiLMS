import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { RefreshCw, Search } from 'lucide-react';

export const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.submissions.getAllSubmissions();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Fetch submissions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filtered = submissions.filter(
    (s) =>
      s.studentEmail.toLowerCase().includes(filterText.toLowerCase()) ||
      (s.studentId?.name && s.studentId.name.toLowerCase().includes(filterText.toLowerCase())) ||
      `ngày ${s.dayNumber}`.includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Full-width Top Card */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#050505]">
              Lịch sử nộp bài Google Form của học viên
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f7f4e8] text-[#877028]">
              {submissions.length} lượt nộp
            </span>
          </div>
          <p className="text-xs text-[#65676B] mt-0.5">
            Dữ liệu ghi nhận tự động từ Webhook Google Apps Script hoặc kiểm tra trực tiếp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-1.5 text-xs text-[#65676B] w-48 sm:w-60">
            <Search className="h-3.5 w-3.5 text-[#65676B]" />
            <input
              type="text"
              placeholder="Lọc email, tên học viên..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[#050505] w-full"
            />
          </div>

          <button
            onClick={fetchSubmissions}
            className="w-9 h-9 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#050505] transition flex-shrink-0"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#877028]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full-width Submissions Table */}
      <div className="fb-card border border-[#CED0D4]/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F2F5] text-[#65676B] font-bold border-b border-[#CED0D4]">
              <tr>
                <th className="py-3 px-4">Học viên</th>
                <th className="py-3 px-4">Bài học</th>
                <th className="py-3 px-4">Điểm số</th>
                <th className="py-3 px-4">Trạng thái (Chuẩn 8/10)</th>
                <th className="py-3 px-4">Nguồn nộp</th>
                <th className="py-3 px-4">Thời gian nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6EB] text-[#050505]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#65676B]">
                    Đang tải danh sách bài nộp...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#65676B]">
                    Không tìm thấy bài nộp nào.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#F0F2F5]/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#050505] text-xs sm:text-sm">
                        {sub.studentId?.name || sub.studentEmail}
                      </p>
                      <p className="text-[11px] text-[#65676B] font-mono">{sub.studentEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#050505]">
                        Ngày {sub.dayNumber}: {sub.lessonId?.title || sub.formId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-sm text-[#050505]">
                      {sub.score} / {sub.maxScore || 10} điểm
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.isPassed ? (
                        <span className="text-xs font-bold text-[#1E7E34] bg-[#E4F8EA] px-2.5 py-1 rounded-full border border-[#B7EB8F] inline-block">
                          ✓ ĐẠT (&gt;= 8/10)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#856404] bg-[#FFF3CD] px-2.5 py-1 rounded-full border border-[#FFEBAA] inline-block">
                          CHƯA ĐẠT (&lt; 8/10)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#65676B]">
                      {sub.source}
                    </td>
                    <td className="py-3.5 px-4 text-[#65676B]">
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
