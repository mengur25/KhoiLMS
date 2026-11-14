import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  BookOpen,
  FileCheck,
  Calendar,
  BarChart2,
  ShieldCheck,
  Settings,
  Award,
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  User,
  Users,
} from 'lucide-react';

export const DribbbleAppShell = ({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  searchQuery,
  onSearch,
  children,
}) => {
  const { user, logout, quickSwitch, isAdmin } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Navigation items: Calendar, Courses, Assignments, Statistics, Settings
  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileCheck },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6D743] p-2.5 sm:p-5 lg:p-7 xl:p-8 flex items-center justify-center font-sans antialiased">
      {/* Central Modern App Card (Matches the Dribbble showcase card) */}
      <div className="w-full max-w-[1550px] bg-white rounded-[26px] sm:rounded-[32px] shadow-2xl border border-black/5 overflow-hidden flex flex-col min-h-[860px]">
        {/* Top Header Bar inside the card */}
        <header className="h-16 px-6 sm:px-8 border-b border-gray-100 flex items-center justify-between gap-4 flex-shrink-0 bg-white">
          {/* Left: Brand Logo (Styled like REDCAR in screenshot) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calendar')}
              className="flex items-center gap-2.5 group"
            >
              {/* Red / Gold Badge Icon like the Red Car */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d9be55] to-[#c4aa44] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition">
                K
              </div>
              <span className="font-extrabold text-base tracking-tight text-gray-900">
                KHÔI LMS
              </span>
            </button>

            <span
              className={`hidden md:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isAdmin
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-amber-50 text-[#856b10] border border-amber-200/60'
              }`}
            >
              {isAdmin ? 'TUTOR ADMIN' : 'STUDENT PORTAL'}
            </span>
          </div>

          {/* Center: Search Bar Pill (Exact Dribbble search) */}
          <div className="hidden sm:flex items-center relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full h-9 pl-4 pr-9 rounded-full bg-[#FAFAFA] hover:bg-gray-100/70 focus:bg-white border border-gray-200/80 text-xs text-gray-800 focus:outline-none focus:border-gray-400 transition"
            />
            <Search className="h-4 w-4 text-gray-400 absolute right-3 pointer-events-none" />
          </div>

          {/* Right: Message, Notification & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Simulator Test Button */}
            <button
              onClick={onOpenSimulator}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d9be55] hover:bg-[#c4aa44] text-white text-xs font-bold transition shadow-xs"
              title="Mô phỏng nộp bài Google Form"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Mô phỏng 8/10</span>
            </button>

            {/* Message Bubble Icon */}
            <button
              onClick={() => setActiveTab('assignments')}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition"
              title="Thông báo bài tập"
            >
              <MessageSquare className="h-4 w-4 text-gray-600" />
            </button>

            {/* Notification Bell Icon with Red Dot (Matches screenshot) */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('statistics')}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition"
                title="Thông báo điểm số"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
              </button>
            </div>

            {/* User Profile Pill ("Tim Nice" style) */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-[#d9be55] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-gray-800 hidden sm:inline max-w-[110px] truncate">
                  {user?.name || 'Tim Nice'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 z-50 animate-in fade-in duration-150">
                  <div className="p-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono truncate">
                      {user?.email}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAdmin
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-amber-50 text-[#856b10]'
                      }`}
                    >
                      {isAdmin ? 'Quản trị Gia sư' : 'Học viên'}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                    Chuyển tài khoản demo:
                  </div>

                  <button
                    onClick={() => {
                      quickSwitch('ADMIN');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition ${
                      isAdmin ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-purple-600" />
                      <span>Thầy Khôi (Gia sư)</span>
                    </div>
                    {isAdmin && <span className="text-purple-600">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      quickSwitch('STUDENT');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition ${
                      !isAdmin && user?.email === 'nguyen@student.com'
                        ? 'bg-amber-50 text-[#856b10] font-bold'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-[#d9be55]" />
                      <span>Nguyễn Văn A (Học viên)</span>
                    </div>
                    {!isAdmin && user?.email === 'nguyen@student.com' && (
                      <span className="text-[#856b10]">✓</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      quickSwitch('STUDENT2');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-gray-50 transition ${
                      !isAdmin && user?.email === 'linh@student.com'
                        ? 'bg-amber-50 text-[#856b10] font-bold'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-[#d9be55]" />
                      <span>Trần Thị Linh (Học viên 2)</span>
                    </div>
                    {!isAdmin && user?.email === 'linh@student.com' && (
                      <span className="text-[#856b10]">✓</span>
                    )}
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Body: Left Sidebar + Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
          {/* Left Sidebar (Matches the Dribbble sidebar) */}
          <aside className="w-full md:w-56 lg:w-60 flex-shrink-0 border-r border-gray-100 py-6 px-4 bg-white flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-visible">
            <div className="space-y-1.5 w-full flex md:flex-col gap-1 md:gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition relative group flex-shrink-0 ${
                      isActive
                        ? 'text-gray-900 font-extrabold'
                        : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {/* The crisp black vertical indicator on active item (Exact Dribbble style) */}
                    {isActive && (
                      <span className="hidden md:block w-1 h-5 bg-gray-900 rounded-r-full absolute left-0 top-1/2 -translate-y-1/2" />
                    )}

                    <Icon
                      className={`h-4 w-4 transition ${
                        isActive
                          ? 'text-gray-900 stroke-[2.5]'
                          : 'text-gray-400 group-hover:text-gray-700'
                      }`}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom mini streak card for student */}
            <div className="hidden md:block pt-6 border-t border-gray-100 mt-6">
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-gray-100 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Chuỗi học tập
                </span>
                <p className="font-extrabold text-gray-900">
                  {user?.streakDays || 1} ngày liên tục
                </p>
                <p className="text-[11px] text-gray-500">
                  Đạt chuẩn &gt;= 8/10 mỗi ngày để duy trì chuỗi
                </p>
              </div>
            </div>
          </aside>

          {/* Right Main Content Workspace */}
          <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto bg-white min-h-[700px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
