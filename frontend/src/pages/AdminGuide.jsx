import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Code, Copy, Check, Sparkles } from 'lucide-react';

export const AdminGuide = ({ onOpenSimulator }) => {
  const [guide, setGuide] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const data = await api.admin.getGuide();
        if (data.success) {
          setGuide(data);
        }
      } catch (err) {
        console.error('Fetch guide error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  const handleCopy = () => {
    if (guide?.scriptCode) {
      navigator.clipboard.writeText(guide.scriptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header Card */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60">
        <h1 className="text-lg sm:text-xl font-bold text-[#050505]">
          Hướng dẫn tích hợp Google Form tự động (Google Apps Script)
        </h1>
        <p className="text-xs text-[#65676B] mt-1">
          Học sinh nộp bài trên Google Form &rarr; Google Apps Script tự động kích hoạt webhook gửi điểm về LMS để xét quy tắc đạt điểm 8/10.
        </p>
      </div>

      {/* Webhook Endpoint Callout */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-[#65676B] uppercase tracking-wider block">
            LMS Webhook Endpoint:
          </span>
          <p className="font-mono text-xs sm:text-sm font-bold text-[#877028] break-all mt-0.5">
            {guide?.webhookUrl || 'http://localhost:5001/api/webhooks/google-form'}
          </p>
        </div>
        <button
          onClick={() => onOpenSimulator()}
          className="fb-btn-primary px-4 py-2 text-xs self-start sm:self-auto font-bold"
        >
          <span>Thử nghiệm nộp bài (Test Webhook)</span>
        </button>
      </div>

      {/* Step by Step Guide (FB Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fb-card p-4 border border-[#CED0D4]/60 space-y-1.5">
          <span className="w-7 h-7 rounded-full bg-[#f7f4e8] text-[#877028] font-extrabold text-xs flex items-center justify-center">
            1
          </span>
          <h3 className="font-bold text-[#050505] text-xs sm:text-sm">Mở Apps Script trên Google Form</h3>
          <p className="text-xs text-[#65676B] leading-relaxed">
            Mở bài trắc nghiệm Google Form &rarr; Nhấp dấu 3 chấm góc phải &rarr; Chọn{' '}
            <strong className="text-[#050505]">Trình chỉnh sửa tập lệnh</strong>.
          </p>
        </div>

        <div className="fb-card p-4 border border-[#CED0D4]/60 space-y-1.5">
          <span className="w-7 h-7 rounded-full bg-[#f7f4e8] text-[#877028] font-extrabold text-xs flex items-center justify-center">
            2
          </span>
          <h3 className="font-bold text-[#050505] text-xs sm:text-sm">Dán Code &amp; Lưu</h3>
          <p className="text-xs text-[#65676B] leading-relaxed">
            Dán đoạn mã bên dưới vào <code className="text-[#877028] font-bold">Code.gs</code> và đổi{' '}
            <code className="text-[#877028] font-bold">FORM_ID</code> theo mã ngày học (ví dụ: DAY_1_FORM).
          </p>
        </div>

        <div className="fb-card p-4 border border-[#CED0D4]/60 space-y-1.5">
          <span className="w-7 h-7 rounded-full bg-[#E4F8EA] text-[#1E7E34] font-extrabold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="font-bold text-[#050505] text-xs sm:text-sm">Tạo Bộ kích hoạt (Trigger)</h3>
          <p className="text-xs text-[#65676B] leading-relaxed">
            Vào menu bên trái chọn <strong className="text-[#050505]">Kích hoạt (Triggers)</strong> &rarr; Thêm trigger{' '}
            <code className="text-[#1E7E34] font-bold">Khi gửi biểu mẫu (On form submit)</code>.
          </p>
        </div>
      </div>

      {/* Code Block Card */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#050505]">
            Mã Google Apps Script hoàn chỉnh (Sẵn sàng copy):
          </span>
          <button
            onClick={handleCopy}
            className="fb-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Sao chép toàn bộ mã</span>
              </>
            )}
          </button>
        </div>
        <pre className="bg-[#1C1E21] text-[#E4E6EB] p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
          {guide?.scriptCode || '// Đang tải mã nguồn...'}
        </pre>
      </div>
    </div>
  );
};
