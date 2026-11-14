import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Lỗi xác thực');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setError('');
    setLoading(true);
    try {
      await login(quickEmail, quickPassword);
    } catch (err) {
      setError(err.message || 'Lỗi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6D743] flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-8">
        {/* Left Column: Brand Hero */}
        <div className="text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/80 shadow-xs mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#d9be55] text-white flex items-center justify-center font-black text-xs">
              K
            </div>
            <span className="font-extrabold text-xs text-gray-900 tracking-wider">
              KHÔI LMS PLATFORM
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Khôi LMS
          </h1>
          <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
            Hệ thống quản lý gia sư &amp; Luyện thi thông minh, tự động chấm điểm và mở khóa lời giải theo quy tắc điểm 8/10 từ Google Form.
          </p>
          <div className="pt-2 hidden md:block text-xs font-semibold text-gray-700">
            Mô hình giảng dạy 1-kèm-1 chất lượng cao.
          </div>
        </div>

        {/* Right Column: Modern Rounded Login Card */}
        <div className="max-w-md w-full mx-auto space-y-4">
          <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-black/5 space-y-4">
            {/* Quick 1-Click Demo Login Bar */}
            <div className="p-3 rounded-lg bg-[#F0F2F5] border border-[#CED0D4] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676B] block">
                Đăng nhập nhanh để trải nghiệm (Demo):
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@lms.com', 'admin123')}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-[#f7f4e8] border border-[#CED0D4] transition flex items-center justify-between text-xs font-semibold text-[#050505] group"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#877028]" />
                    <span>Thầy Khôi (Gia sư / Quản trị)</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#65676B] group-hover:text-[#877028] transition" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('nguyen@student.com', 'student123')}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-[#f7f4e8] border border-[#CED0D4] transition flex items-center justify-between text-xs font-semibold text-[#050505] group"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[#42B72A]" />
                    <span>Nguyễn Văn A (Học viên)</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#65676B] group-hover:text-[#877028] transition" />
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-lg bg-[#FFEBE8] border border-[#DD3C10] text-[#DD3C10] text-xs font-medium">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên của bạn"
                    className="w-full border border-[#CED0D4] rounded-lg px-3.5 py-3 text-sm text-[#050505] focus:outline-none focus:border-[#d9be55] focus:ring-1 focus:ring-[#d9be55]"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email hoặc số điện thoại"
                  className="w-full border border-[#CED0D4] rounded-lg px-3.5 py-3 text-sm text-[#050505] focus:outline-none focus:border-[#d9be55] focus:ring-1 focus:ring-[#d9be55]"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full border border-[#CED0D4] rounded-lg px-3.5 py-3 text-sm text-[#050505] focus:outline-none focus:border-[#d9be55] focus:ring-1 focus:ring-[#d9be55]"
                />
              </div>

              {isRegister && (
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-[#CED0D4] rounded-lg px-3.5 py-2.5 text-sm text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  >
                    <option value="STUDENT">Học viên (Luyện thi)</option>
                    <option value="ADMIN">Gia sư / Quản trị viên</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full fb-btn-primary py-3 text-base font-bold shadow-xs transition disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
              </button>
            </form>

            <div className="border-t border-[#CED0D4] my-3" />

            {/* Facebook Green "Create Account" Style Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="px-4 py-2.5 rounded-lg bg-[#42B72A] hover:bg-[#36A420] text-white font-bold text-sm transition shadow-xs"
              >
                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Tạo tài khoản mới'}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-[#65676B]">
            <strong>Khôi LMS</strong> dành riêng cho việc luyện thi và mở khóa lời giải Google Form.
          </p>
        </div>
      </div>
    </div>
  );
};
