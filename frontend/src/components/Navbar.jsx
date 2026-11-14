import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Code,
  LogOut,
  ChevronDown,
  Shield,
  User,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenSimulator, onSearch, searchQuery }) => {
  const { user, logout, quickSwitch, isAdmin } = useAuth();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#CED0D4] shadow-2xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left Section: Logo & Portal Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setActiveTab(isAdmin ? 'admin_lessons' : 'roadmap')}
            className="w-10 h-10 rounded-full bg-[#d9be55] hover:bg-[#c4aa44] text-white flex items-center justify-center font-black text-xl shadow-xs transition"
            title="Khôi LMS"
          >
            K
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#050505] text-sm tracking-tight">
                Khôi LMS
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                isAdmin ? 'bg-[#F3E8FF] text-[#7E22CE]' : 'bg-[#f7f4e8] text-[#877028]'
              }`}>
                {isAdmin ? 'Giao diện Quản trị Gia sư' : 'Giao diện Học viên'}
              </span>
            </div>
          </div>

          {/* Search Pill */}
          <div className="flex items-center gap-2 bg-[#F0F2F5] hover:bg-[#E4E6EB] transition rounded-full px-3 py-1.5 text-xs text-[#65676B] w-48 md:w-64 ml-2">
            <Search className="h-3.5 w-3.5 text-[#65676B] flex-shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[#050505] w-full placeholder-[#65676B]"
            />
          </div>
        </div>

        {/* Center Tabs (Facebook Icon Nav) */}
        <nav className="hidden md:flex items-center justify-center h-full max-w-lg mx-4 flex-1">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('admin_lessons')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-3 ${
                  activeTab === 'admin_lessons' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Giáo trình & Form"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5 hidden xl:inline">Giáo trình</span>
                {activeTab === 'admin_lessons' && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('admin_students')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-3 ${
                  activeTab === 'admin_students' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Học viên"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5 hidden xl:inline">Học viên</span>
                {activeTab === 'admin_students' && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('admin_submissions')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-3 ${
                  activeTab === 'admin_submissions' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Lịch sử nộp"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5 hidden xl:inline">Lịch sử nộp</span>
                {activeTab === 'admin_submissions' && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('admin_guide')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-3 ${
                  activeTab === 'admin_guide' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Cài đặt Google Form"
              >
                <Code className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5 hidden xl:inline">Cài đặt Form</span>
                {activeTab === 'admin_guide' && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-4 ${
                  activeTab === 'roadmap' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Lộ trình bài học"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5">Lộ trình bài học</span>
                {activeTab === 'roadmap' && (
                  <span className="absolute bottom-0 left-4 right-4 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 h-full flex items-center justify-center relative transition hover:bg-[#F0F2F5] rounded-lg my-1 px-4 ${
                  activeTab === 'history' ? 'text-[#877028]' : 'text-[#65676B]'
                }`}
                title="Lịch sử điểm số"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs font-semibold ml-1.5">Lịch sử nộp Form</span>
                {activeTab === 'history' && (
                  <span className="absolute bottom-0 left-4 right-4 h-1 bg-[#d9be55] rounded-t-md" />
                )}
              </button>
            </>
          )}
        </nav>

        {/* Right Section: User Profile & Quick Switch */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSimulator}
            className="h-9 px-3.5 rounded-full bg-[#d9be55] hover:bg-[#c4aa44] text-white text-xs font-bold flex items-center transition shadow-2xs"
            title="Thử nghiệm điểm số (Test quy tắc 8/10)"
          >
            <span>Mô phỏng điểm</span>
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowSwitchMenu(!showSwitchMenu)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F0F2F5] transition text-left"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isAdmin ? 'bg-[#7E22CE] text-white' : 'bg-[#d9be55] text-white'
              }`}>
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-semibold text-[#050505] hidden md:inline max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#65676B]" />
            </button>

            {/* Dropdown Menu */}
            {showSwitchMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#CED0D4] p-2 z-50 animate-in fade-in duration-100">
                <div className="p-2 border-b border-[#E4E6EB] mb-1">
                  <p className="text-xs font-bold text-[#050505]">{user?.name}</p>
                  <p className="text-[11px] text-[#65676B] font-mono">{user?.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isAdmin ? 'bg-[#F3E8FF] text-[#7E22CE]' : 'bg-[#f7f4e8] text-[#877028]'
                  }`}>
                    {isAdmin ? 'Quyền: Gia sư / Quản trị viên' : 'Quyền: Học viên'}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-[#65676B] px-2 py-1 uppercase tracking-wider">
                  Chuyển đổi giao diện:
                </div>

                <button
                  onClick={() => {
                    quickSwitch('ADMIN');
                    setShowSwitchMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#F2F4F7] text-xs font-medium flex items-center justify-between ${
                    isAdmin ? 'bg-[#F3E8FF]/60 text-[#7E22CE]' : 'text-[#050505]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#7E22CE]" />
                    <span>Giao diện Gia sư (Thầy Khôi)</span>
                  </div>
                  {isAdmin && <span className="text-xs font-bold text-[#7E22CE]">✓</span>}
                </button>

                <button
                  onClick={() => {
                    quickSwitch('STUDENT');
                    setShowSwitchMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#F2F4F7] text-xs font-medium flex items-center justify-between ${
                    !isAdmin && user?.email === 'nguyen@student.com' ? 'bg-[#f7f4e8] text-[#877028]' : 'text-[#050505]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#a88f34]" />
                    <span>Giao diện Học viên 1 (Nguyễn Văn A)</span>
                  </div>
                  {!isAdmin && user?.email === 'nguyen@student.com' && (
                    <span className="text-xs font-bold text-[#877028]">✓</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    quickSwitch('STUDENT2');
                    setShowSwitchMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#F2F4F7] text-xs font-medium flex items-center justify-between ${
                    !isAdmin && user?.email === 'linh@student.com' ? 'bg-[#f7f4e8] text-[#877028]' : 'text-[#050505]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#a88f34]" />
                    <span>Giao diện Học viên 2 (Trần Thị Linh)</span>
                  </div>
                  {!isAdmin && user?.email === 'linh@student.com' && (
                    <span className="text-xs font-bold text-[#877028]">✓</span>
                  )}
                </button>

                <div className="border-t border-[#E4E6EB] my-1" />
                <button
                  onClick={() => {
                    logout();
                    setShowSwitchMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FFEBE8] text-xs font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
