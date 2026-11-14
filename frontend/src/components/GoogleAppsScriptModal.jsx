import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { X, Copy, Check, Code } from 'lucide-react';

export const GoogleAppsScriptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-5 shadow-xl relative text-slate-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Mã kết nối Google Form (Google Apps Script)
            </h3>
            <p className="text-xs text-slate-500">
              Tự động gửi kết quả điểm thi từ Google Form về LMS khi học viên nộp bài
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3.5 space-y-3.5 overflow-y-auto pr-1 text-xs flex-1">
          {/* Webhook endpoint */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Webhook URL nhận điểm:
              </span>
              <p className="font-mono text-xs text-blue-700 font-semibold break-all">
                {guide?.webhookUrl || 'http://localhost:5001/api/webhooks/google-form'}
              </p>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
              Sẵn sàng
            </span>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-1.5">
              Các bước cài đặt (2 phút):
            </h4>
            <ol className="space-y-1 text-slate-600 list-decimal list-inside bg-slate-50 p-3 rounded-lg border border-slate-200">
              {guide?.instructions?.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Script Code Block */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700">
                Mã script (Sao chép và dán vào Apps Script):
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Đã chép!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Sao chép mã
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-52 leading-relaxed">
              {guide?.scriptCode || '// Đang tải mã nguồn...'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
