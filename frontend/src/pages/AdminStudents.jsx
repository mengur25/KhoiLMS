import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { RefreshCw, Search } from 'lucide-react';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getStudents();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Full-width Top Card */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#050505]">
              Danh sách &amp; Tiến độ học viên
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f7f4e8] text-[#877028]">
              {students.length} học viên
            </span>
          </div>
          <p className="text-xs text-[#65676B] mt-0.5">
            Theo dõi số bài học sinh đã đạt chuẩn &gt;= 8/10 và điểm nộp gần nhất từ Google Form
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-1.5 text-xs text-[#65676B] w-48 sm:w-60">
            <Search className="h-3.5 w-3.5 text-[#65676B]" />
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[#050505] w-full"
            />
          </div>

          <button
            onClick={fetchStudents}
            className="w-9 h-9 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#050505] transition flex-shrink-0"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#877028]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full-width Table Card */}
      <div className="fb-card border border-[#CED0D4]/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F2F5] text-[#65676B] font-bold border-b border-[#CED0D4]">
              <tr>
                <th className="py-3 px-4">Học viên</th>
                <th className="py-3 px-4 min-w-[220px]">Tiến độ bài học</th>
                <th className="py-3 px-4 w-32">Chuỗi học tập</th>
                <th className="py-3 px-4">Lần nộp gần nhất</th>
                <th className="py-3 px-4 w-36">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6EB] text-[#050505]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[#65676B]">
                    Đang tải danh sách học viên...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[#65676B]">
                    Không tìm thấy học viên nào.
                  </td>
                </tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st._id} className="hover:bg-[#F0F2F5]/60 transition">
                    {/* User info with circular avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d9be55] text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                          {st.name ? st.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#050505] text-sm">{st.name}</p>
                          <p className="text-[11px] text-[#65676B] font-mono">{st.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex justify-between font-semibold text-xs mb-1">
                        <span>{st.passedLessonsCount} / {st.totalLessons} ngày đạt chuẩn</span>
                        <span className="text-[#877028] font-bold">{st.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-[#E4E6EB] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#d9be55] h-2 rounded-full"
                          style={{ width: `${st.progressPercentage}%` }}
                        />
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#D97706]">
                        <span>{st.streakDays || 1} ngày liên tục</span>
                      </div>
                    </td>

                    {/* Latest Submission */}
                    <td className="py-3.5 px-4">
                      {st.latestSubmission ? (
                        <div>
                          <span className="font-bold text-[#050505]">
                            Ngày {st.latestSubmission.dayNumber}: {st.latestSubmission.score}/{st.latestSubmission.maxScore || 10} điểm
                          </span>
                          <p className="text-[11px] text-[#65676B]">
                            {new Date(st.latestSubmission.submittedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[#65676B]">Chưa nộp bài</span>
                      )}
                    </td>

                    {/* Evaluation status */}
                    <td className="py-3.5 px-4">
                      {st.progressPercentage >= 50 ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E4F8EA] text-[#1E7E34] border border-[#B7EB8F]">
                          Tiến độ tốt
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF3CD] text-[#856404] border border-[#FFEBAA]">
                          Cần đôn đốc
                        </span>
                      )}
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
