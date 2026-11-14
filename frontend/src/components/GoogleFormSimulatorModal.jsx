import React, { useState } from 'react';
import { api } from '../api/client';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';

export const GoogleFormSimulatorModal = ({ isOpen, onClose, lessons, onSubmitted }) => {
  if (!isOpen) return null;

  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?._id || '');
  const [studentEmail, setStudentEmail] = useState('nguyen@student.com');
  const [score, setScore] = useState(8.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const selectedLesson = lessons.find((l) => l._id === selectedLessonId) || lessons[0];

  const handleSimulate = async (scoreToSubmit = score) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.submissions.simulate({
        lessonId: selectedLessonId,
        score: Number(scoreToSubmit),
        studentEmail: studentEmail.trim(),
        notes: `Mô phỏng nộp Google Form`,
      });

      setResult(data);

      if (onSubmitted) {
        onSubmitted(data);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi gửi kết quả mô phỏng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-[#CED0D4] relative text-[#050505]">
        {/* Facebook-style Modal Header */}
        <div className="px-4 py-3 border-b border-[#E4E6EB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#050505]">
              Mô phỏng nộp điểm Google Form
            </h3>
            <p className="text-[11px] text-[#65676B]">
              Công cụ thử nghiệm quy tắc mở khóa điểm chuẩn 8/10
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#65676B] hover:text-[#050505] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Email input */}
          <div>
            <label className="block font-bold text-[#050505] mb-1">
              Email học viên:
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white border border-[#CED0D4] rounded-lg px-3 py-2 text-xs text-[#050505] focus:outline-none focus:border-[#d9be55] transition"
              placeholder="nguyen@student.com"
            />
          </div>

          {/* Lesson select */}
          <div>
            <label className="block font-bold text-[#050505] mb-1">
              Chọn bài kiểm tra:
            </label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-xs text-[#050505] focus:outline-none focus:border-[#d9be55]"
            >
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  Ngày {l.dayNumber}: {l.title} (Chuẩn: {l.passingScore || 8}/10)
                </option>
              ))}
            </select>
          </div>

          {/* Score Slider & Presets */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#050505]">
                Điểm số trên Google Form:
              </label>
              <span className="text-sm font-extrabold text-[#877028]">
                {score} / 10 điểm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              className="w-full accent-[#d9be55] cursor-pointer h-2 bg-[#E4E6EB] rounded-lg"
            />

            {/* Quick Test Preset Buttons */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-[#65676B]">Mẫu test:</span>
              <button
                type="button"
                onClick={() => {
                  setScore(6);
                  handleSimulate(6);
                }}
                className="px-2.5 py-1 text-xs rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#65676B] font-semibold border border-[#CED0D4]"
              >
                6/10 (Dưới chuẩn 8)
              </button>
              <button
                type="button"
                onClick={() => {
                  setScore(8.5);
                  handleSimulate(8.5);
                }}
                className="px-2.5 py-1 text-xs rounded-full bg-[#f7f4e8] hover:bg-[#ede7d1] text-[#877028] font-bold border border-[#d9be55]/40"
              >
                8.5/10 (Đạt chuẩn)
              </button>
              <button
                type="button"
                onClick={() => {
                  setScore(10);
                  handleSimulate(10);
                }}
                className="px-2.5 py-1 text-xs rounded-full bg-[#E4F8EA] hover:bg-[#CEF5D6] text-[#1E7E34] font-bold border border-[#42B72A]/30"
              >
                10/10 (Tối đa)
              </button>
            </div>
          </div>

          {/* Submit Button (FB Blue) */}
          <button
            onClick={() => handleSimulate()}
            disabled={loading}
            className="w-full mt-2 fb-btn-primary py-2.5 text-xs flex items-center justify-center transition disabled:opacity-50"
          >
            {loading ? (
              <span>Đang xử lý webhook...</span>
            ) : (
              <span>Nộp điểm &amp; Kiểm tra Quy tắc 8/10</span>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Alert */}
          {result && (
            <div
              className={`p-3 rounded-lg border text-xs ${
                result.isPassed
                  ? 'bg-[#E4F8EA] border-[#B7EB8F] text-[#1E7E34]'
                  : 'bg-[#FFF3CD] border-[#FFEBAA] text-[#856404]'
              }`}
            >
              <div className="font-bold mb-0.5">
                {result.isPassed ? (
                  <span>ĐẠT CHUẨN: ĐÃ MỞ KHÓA LỜI GIẢI ({result.score}/10 &gt;= 8)</span>
                ) : (
                  <span>CHƯA ĐẠT: LỜI GIẢI VẪN BỊ KHÓA ({result.score}/10 &lt; 8)</span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
