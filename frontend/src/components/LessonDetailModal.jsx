import React, { useState } from 'react';
import { api } from '../api/client';
import { X, ExternalLink, RefreshCw } from 'lucide-react';

export const LessonDetailModal = ({
  lesson,
  isOpen,
  onClose,
  onOpenSimulator,
  onScoreUpdated,
}) => {
  if (!isOpen || !lesson) return null;

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [activeLesson, setActiveLesson] = useState(lesson);

  const isPassed = activeLesson.hasPassed || activeLesson.isUnlocked;
  const bestScore = activeLesson.bestScore;

  const handleCheckGoogleForm = async () => {
    setChecking(true);
    setCheckResult(null);

    try {
      const data = await api.submissions.checkGoogleForm(activeLesson._id);
      setCheckResult(data);

      if (data.found && data.isPassed) {
        setActiveLesson((prev) => ({
          ...prev,
          hasPassed: true,
          bestScore: data.score,
          unlockedSolution: data.unlockedSolution,
          unlockedDriveLink: data.unlockedDriveLink,
          solutionLocked: false,
        }));

        if (onScoreUpdated) onScoreUpdated();
      }
    } catch (err) {
      setCheckResult({
        found: false,
        message: err.message || 'Lỗi khi kiểm tra kết quả từ Google Form',
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-[#CED0D4] relative text-[#050505] max-h-[90vh] flex flex-col">
        {/* Facebook-style Modal Header */}
        <div className="relative px-4 py-3.5 border-b border-[#E4E6EB] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#050505]">
              Ngày {activeLesson.dayNumber}: {activeLesson.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#65676B] mt-0.5">
              <span>Điểm chuẩn: {activeLesson.passingScore || 8}/10</span>
              <span>&bull;</span>
              <span>Công khai</span>
            </div>
          </div>

          {/* Facebook-style Circular Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#65676B] hover:text-[#050505] transition"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto pr-2 text-sm flex-1">
          {/* Section 1: Lesson Theory Content */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676B]">
              Nội dung &amp; Hướng dẫn học tập
            </h3>
            <div className="bg-[#F0F2F5] p-3.5 rounded-lg border border-[#E4E6EB] text-xs sm:text-sm leading-relaxed text-[#050505] whitespace-pre-wrap">
              {activeLesson.content}
            </div>
          </div>

          {/* Section 2: Reference resources */}
          {activeLesson.resources && activeLesson.resources.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676B]">
                Tài liệu tham khảo
              </h3>
              <div className="space-y-1">
                {activeLesson.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F0F2F5] hover:bg-[#E4E6EB] text-xs font-medium text-[#050505] transition"
                  >
                    <span>{res.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#65676B]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Facebook-style Link Attachment (Google Form) */}
          <div className="border border-[#CED0D4] rounded-lg overflow-hidden bg-[#F0F2F5]/60 p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#050505]">
                  Bài kiểm tra trắc nghiệm Google Form
                </h4>
                <p className="text-[11px] text-[#65676B] mt-0.5">
                  Điểm đạt chuẩn để mở khóa lời giải: <strong>{activeLesson.passingScore || 8}/10 điểm</strong>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={activeLesson.googleFormUrl || 'https://forms.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fb-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Mở Google Form</span>
                </a>

                <button
                  onClick={handleCheckGoogleForm}
                  disabled={checking}
                  className="fb-btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  {checking ? 'Đang kiểm tra...' : 'Kiểm tra điểm'}
                </button>
              </div>
            </div>

            {/* Check Result status alert */}
            {checkResult && (
              <div
                className={`p-3 rounded-lg text-xs border ${
                  checkResult.isPassed
                    ? 'bg-[#E4F8EA] border-[#B7EB8F] text-[#1E7E34]'
                    : 'bg-[#FFF3CD] border-[#FFEBAA] text-[#856404]'
                }`}
              >
                <p className="font-semibold">{checkResult.message}</p>
                {checkResult.found && (
                  <p className="text-[11px] mt-0.5">
                    Điểm Google Form ghi nhận: <strong>{checkResult.score}/{checkResult.maxScore || 10}</strong> (Mốc đạt: &gt;= {checkResult.passingScore}/10)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Gated Solutions (The 8/10 Rule) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676B]">
              Lời giải chi tiết bài tập (Quy tắc điểm 8/10)
            </h3>

            {isPassed ? (
              <div className="p-4 rounded-xl bg-[#E4F8EA]/50 border border-[#B7EB8F] space-y-2.5">
                <div className="text-xs font-bold text-[#1E7E34]">
                  <span>Chúc mừng bạn đã đạt chuẩn &gt;= 8/10 điểm! Lời giải chi tiết:</span>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#B7EB8F] font-mono text-xs text-[#050505] whitespace-pre-wrap leading-relaxed shadow-2xs">
                  {activeLesson.unlockedSolution || 'Nội dung lời giải chi tiết của ngày học này.'}
                </div>

                {activeLesson.unlockedDriveLink && (
                  <a
                    href={activeLesson.unlockedDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#877028] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Mở thư mục Google Drive bài giảng &amp; Video</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#F0F2F5] border border-[#CED0D4] text-center space-y-1.5">
                <div className="text-xs font-bold text-[#65676B]">
                  <span>Lời giải chi tiết đang bị khóa</span>
                </div>
                <p className="text-xs text-[#65676B] max-w-md mx-auto">
                  Bạn cần hoàn thành bài kiểm tra trên Google Form và đạt từ{' '}
                  <strong className="text-[#050505]">{activeLesson.passingScore || 8}/10 điểm</strong>{' '}
                  trở lên để hệ thống mở khóa đáp án chi tiết.
                </p>
                {bestScore !== null && bestScore !== undefined && (
                  <p className="text-xs font-semibold text-[#856404]">
                    Điểm số gần nhất của bạn: {bestScore}/10
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Facebook-style Modal Footer */}
        <div className="px-4 py-3 border-t border-[#E4E6EB] flex items-center justify-between flex-shrink-0 bg-[#F0F2F5]/40 rounded-b-xl">
          <button
            onClick={() => {
              onClose();
              onOpenSimulator(activeLesson);
            }}
            className="text-xs text-[#65676B] hover:text-[#877028] font-semibold transition"
          >
            <span>Mô phỏng nộp điểm (Test 8/10)</span>
          </button>

          <button
            onClick={onClose}
            className="fb-btn-secondary px-4 py-1.5 text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
