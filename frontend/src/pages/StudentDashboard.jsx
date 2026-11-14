import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LessonDetailModal } from '../components/LessonDetailModal';
import {
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const StudentDashboard = ({ activeTab, onOpenSimulator, searchQuery }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [checkingLessonId, setCheckingLessonId] = useState(null);
  const [checkStatusMessage, setCheckStatusMessage] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, subsRes] = await Promise.all([
        api.lessons.getAll(),
        api.submissions.getMySubmissions(),
      ]);

      if (lessonsRes.success) setLessons(lessonsRes.lessons);
      if (subsRes.success) setSubmissions(subsRes.submissions);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleQuickCheck = async (lesson) => {
    setCheckingLessonId(lesson._id);
    try {
      const data = await api.submissions.checkGoogleForm(lesson._id);
      setCheckStatusMessage((prev) => ({
        ...prev,
        [lesson._id]: {
          message: data.message,
          isPassed: data.isPassed,
          score: data.score,
        },
      }));
      if (data.isPassed) {
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      setCheckStatusMessage((prev) => ({
        ...prev,
        [lesson._id]: {
          message: err.message || 'Lỗi kiểm tra điểm Google Form',
          isPassed: false,
        },
      }));
    } finally {
      setCheckingLessonId(null);
    }
  };

  const passedLessonsCount = lessons.filter((l) => l.hasPassed).length;
  const progressPercent = lessons.length > 0 ? Math.round((passedLessonsCount / lessons.length) * 100) : 0;

  const filteredLessons = lessons.filter((lesson) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lesson.title?.toLowerCase().includes(query) ||
      lesson.description?.toLowerCase().includes(query) ||
      `ngày ${lesson.dayNumber}`.includes(query)
    );
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Full-width responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column (Shortcuts) - 3 cols */}
        <aside className="hidden lg:block lg:col-span-3 space-y-3 sticky top-20 self-start">
          <div className="fb-card p-3.5 border border-[#CED0D4]/60 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d9be55] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : 'H'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#050505] truncate">{user?.name}</p>
                <p className="text-xs text-[#65676B]">Học viên luyện thi</p>
              </div>
            </div>

            <div className="border-t border-[#E4E6EB] pt-2">
              <div className="flex justify-between text-xs text-[#65676B] mb-1">
                <span>Tiến độ của bạn:</span>
                <span className="font-bold text-[#877028]">{passedLessonsCount}/{lessons.length} ngày</span>
              </div>
              <div className="w-full bg-[#E4E6EB] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#d9be55] h-1.5 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="fb-card p-2 border border-[#CED0D4]/60 space-y-1 text-sm font-medium text-[#050505]">
            <div
              className={`flex items-center p-2.5 rounded-lg transition cursor-pointer ${
                activeTab === 'roadmap' ? 'bg-[#f7f4e8] text-[#877028] font-bold' : 'hover:bg-[#F0F2F5]'
              }`}
            >
              <span>Lộ trình bài học</span>
            </div>

            <div
              className={`flex items-center p-2.5 rounded-lg transition cursor-pointer ${
                activeTab === 'history' ? 'bg-[#f7f4e8] text-[#877028] font-bold' : 'hover:bg-[#F0F2F5]'
              }`}
            >
              <span>Lịch sử nộp Google Form</span>
            </div>

            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2.5 rounded-lg hover:bg-[#F0F2F5] transition cursor-pointer text-[#050505]"
            >
              <span>Tài liệu bài giảng Drive</span>
            </a>
          </div>

          <div className="p-3 text-[11px] text-[#65676B] leading-relaxed">
            Quy tắc 8/10: Làm bài trên Google Form đạt tối thiểu 8 điểm để mở khóa lời giải chi tiết.
          </div>
        </aside>

        {/* Center / Main Feed - 6 cols on desktop, stretches wide */}
        <main className="lg:col-span-6 space-y-4">
          {/* Top Status Header */}
          <div className="fb-card p-4 border border-[#CED0D4]/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#f7f4e8] text-[#877028] flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'H'}
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#050505]">
                  Lộ trình học tập &bull; Khóa luyện thi 1-kèm-1
                </h1>
                <p className="text-xs text-[#65676B]">
                  Mỗi ngày hoàn thành 1 bài kiểm tra Google Form đạt tối thiểu 8/10 điểm
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-[#FFF4E5] text-[#D97706] text-xs font-bold flex-shrink-0">
              <span>{user?.streakDays || 1} ngày liên tục</span>
            </div>
          </div>

          {/* Submissions History Tab */}
          {activeTab === 'history' ? (
            <div className="fb-card p-4 border border-[#CED0D4]/60 space-y-3">
              <h2 className="text-sm font-bold text-[#050505]">
                Lịch sử các lần nộp bài Google Form
              </h2>
              <div className="divide-y divide-[#E4E6EB] text-xs">
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-[#65676B]">Chưa có bài nộp nào.</div>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub._id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#050505]">
                          Ngày {sub.dayNumber}: {sub.lessonId?.title || sub.formId}
                        </p>
                        <p className="text-[11px] text-[#65676B]">
                          {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-[#050505]">
                          {sub.score}/{sub.maxScore || 10} điểm
                        </span>
                        <div className="mt-0.5">
                          {sub.isPassed ? (
                            <span className="text-[10px] font-bold text-[#1E7E34] bg-[#E4F8EA] px-2 py-0.5 rounded-full">
                              ĐẠT CHUẨN (&gt;= 8)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#856404] bg-[#FFF3CD] px-2 py-0.5 rounded-full">
                              CHƯA ĐẠT (&lt; 8)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Main Feed of Lessons (No tutor branding on student cards) */
            <div className="space-y-4">
              {loading ? (
                <div className="fb-card p-8 text-center text-xs text-[#65676B]">
                  Đang tải bài học...
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="fb-card p-8 text-center text-xs text-[#65676B]">
                  Không có bài học nào phù hợp.
                </div>
              ) : (
                filteredLessons.map((lesson) => {
                  const isLocked = lesson.isLocked;
                  const hasPassed = lesson.hasPassed;
                  const bestScore = lesson.bestScore;
                  const statusMsg = checkStatusMessage[lesson._id];

                  return (
                    <article
                      key={lesson._id}
                      className="fb-card border border-[#CED0D4]/60 overflow-hidden"
                    >
                      {/* Post Header: Day Badge & Clean Lesson Title */}
                      <div className="p-4 pb-2 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                              hasPassed
                                ? 'bg-[#E4F8EA] text-[#1E7E34]'
                                : isLocked
                                ? 'bg-[#E4E6EB] text-[#65676B]'
                                : 'bg-[#f7f4e8] text-[#877028]'
                            }`}
                          >
                            {lesson.dayNumber}
                          </div>
                          <div>
                            <h2 className="font-bold text-sm sm:text-base text-[#050505]">
                              Ngày {lesson.dayNumber}: {lesson.title}
                            </h2>
                            <div className="flex items-center gap-1.5 text-xs text-[#65676B] mt-0.5">
                              <span>Mục tiêu: Đạt tối thiểu {lesson.passingScore || 8}/10 điểm</span>
                              <span>&bull;</span>
                              {isLocked ? (
                                <span className="text-[#65676B] font-medium">Đang khóa</span>
                              ) : (
                                <span className="text-[#877028] font-medium">Sẵn sàng học</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {hasPassed ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E4F8EA] text-[#1E7E34] border border-[#B7EB8F]">
                              Đã đạt ({bestScore}/10)
                            </span>
                          ) : bestScore !== null && bestScore !== undefined ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF3CD] text-[#856404] border border-[#FFEBAA]">
                              Điểm: {bestScore}/10 (Cần đạt &gt;= 8)
                            </span>
                          ) : isLocked ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#E4E6EB] text-[#65676B]">
                              Bị khóa
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f7f4e8] text-[#877028]">
                              Đang học
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="px-4 py-2 text-xs sm:text-sm text-[#050505] leading-relaxed">
                        <p className="whitespace-pre-line">
                          {lesson.description || lesson.content}
                        </p>
                      </div>

                      {/* Google Form Attachment Card */}
                      <div className="px-4 py-2">
                        <div className="border border-[#CED0D4] rounded-lg overflow-hidden bg-[#F0F2F5]/60 hover:bg-[#F0F2F5] transition p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-[#65676B] tracking-wider block">
                              GOOGLE FORM &bull; BÀI KIỂM TRA TRẮC NGHIỆM
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-[#050505] truncate mt-0.5">
                              Bài kiểm tra Ngày {lesson.dayNumber}
                            </h3>
                            <p className="text-[11px] text-[#65676B]">
                              Đạt từ 8/10 điểm trở lên để tự động mở khóa lời giải
                            </p>
                          </div>

                          {!isLocked && lesson.googleFormUrl && (
                            <a
                              href={lesson.googleFormUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fb-btn-primary px-3 py-1.5 text-xs flex items-center gap-1 flex-shrink-0"
                            >
                              <span>Mở Form</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Score feedback notice */}
                      {statusMsg && (
                        <div className="mx-4 mb-2 p-2.5 rounded-lg text-xs border bg-white">
                          <p className={`font-semibold ${statusMsg.isPassed ? 'text-[#1E7E34]' : 'text-[#856404]'}`}>
                            {statusMsg.message}
                          </p>
                        </div>
                      )}

                      <div className="border-t border-[#E4E6EB] mx-4 mt-2" />

                      {/* 3 Interaction Buttons */}
                      <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#65676B]">
                        {lesson.googleFormUrl ? (
                          <a
                            href={lesson.googleFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 text-center hover:bg-[#f7f4e8] rounded-lg transition text-[#877028] font-bold"
                          >
                            Làm bài Form
                          </a>
                        ) : (
                          <button
                            disabled
                            className="flex-1 py-2 text-center rounded-lg opacity-40 cursor-not-allowed"
                          >
                            Làm bài Form
                          </button>
                        )}

                        <button
                          onClick={() => handleQuickCheck(lesson)}
                          disabled={isLocked || checkingLessonId === lesson._id}
                          className="flex-1 py-2 text-center hover:bg-[#F0F2F5] rounded-lg transition disabled:opacity-40 text-[#42B72A]"
                        >
                          {checkingLessonId === lesson._id ? 'Đang kiểm tra...' : 'Kiểm tra điểm'}
                        </button>

                        <button
                          onClick={() => setSelectedLesson(lesson)}
                          disabled={isLocked}
                          className="flex-1 py-2 text-center hover:bg-[#F0F2F5] rounded-lg transition disabled:opacity-40"
                        >
                          {hasPassed ? (
                            <span className="text-[#1E7E34] font-bold">Xem lời giải</span>
                          ) : (
                            <span>Chi tiết bài học</span>
                          )}
                        </button>
                      </div>

                      {/* Unlocked Solution Card (Pure solution, no tutor branding) */}
                      {hasPassed && lesson.unlockedSolution && (
                        <div className="bg-[#F0F2F5]/70 p-4 border-t border-[#E4E6EB]">
                          <div className="bg-white p-3.5 rounded-xl border border-[#CED0D4] text-xs text-[#050505] space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1E7E34]">
                                Lời giải chi tiết &amp; Phân tích đáp án (Đã mở khóa)
                              </span>
                              <span className="text-[10px] text-[#1E7E34] font-bold bg-[#E4F8EA] px-2 py-0.5 rounded-full">
                                Đạt chuẩn &gt;= 8
                              </span>
                            </div>
                            <div className="bg-[#F0F2F5]/70 p-3 rounded-lg border border-[#CED0D4] max-h-56 overflow-y-auto">
                              <p className="font-mono text-[#050505] whitespace-pre-wrap leading-relaxed text-xs">
                                {lesson.unlockedSolution}
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedLesson(lesson)}
                              className="text-[#877028] hover:underline font-semibold text-xs inline-block"
                            >
                              Xem đầy đủ lời giải trong cửa sổ riêng...
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          )}
        </main>

        {/* Right Column: Widgets - 3 cols */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 self-start">
          <div className="fb-card p-4 border border-[#CED0D4]/60 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676B]">
              Quy tắc điểm chuẩn 8/10
            </h3>
            <p className="text-xs text-[#050505] leading-relaxed">
              Hệ thống tự động đồng bộ kết quả từ Google Form:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-[#E4F8EA] text-[#1E7E34] font-semibold">
                &bull; Điểm &gt;= 8: Mở khóa lời giải chi tiết và mở ngày học tiếp theo.
              </div>
              <div className="p-2 rounded bg-[#FFF3CD] text-[#856404] font-semibold">
                &bull; Điểm &lt; 8: Lời giải tiếp tục bị khóa để bạn tự ôn tập và làm lại.
              </div>
            </div>

            <button
              onClick={() => onOpenSimulator(lessons[0])}
              className="w-full mt-2 fb-btn-primary py-2 text-xs font-bold flex items-center justify-center transition"
            >
              <span>Thử nghiệm nộp điểm (Test 8/10)</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        lesson={selectedLesson}
        isOpen={Boolean(selectedLesson)}
        onClose={() => setSelectedLesson(null)}
        onOpenSimulator={(les) => {
          setSelectedLesson(null);
          onOpenSimulator(les);
        }}
        onScoreUpdated={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};
