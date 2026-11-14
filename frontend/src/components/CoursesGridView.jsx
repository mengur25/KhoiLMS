import React, { useState } from 'react';
import {
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  CheckCircle,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  Sparkles,
  Search,
} from 'lucide-react';

export const CoursesGridView = ({
  lessons = [],
  isAdmin = false,
  onSelectLesson,
  onAddLesson,
  onOpenSimulator,
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PASSED' | 'PENDING'
  const [sortBy, setSortBy] = useState('DAY'); // 'DAY' | 'SCORE' | 'TITLE'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Pastel theme palettes matching the Dribbble thumbnail banners exactly
  const bannerThemes = [
    {
      bg: 'bg-[#F7F2E7]',
      folderFill: '#8A7342',
      folderBack: '#D2B980',
      badge: '14 lessons',
      tags: ['UX design', 'UI design'],
      level: 'Advance',
    },
    {
      bg: 'bg-[#EFF5F0]',
      folderFill: '#457B5A',
      folderBack: '#87BBA2',
      badge: '8 lessons',
      tags: ['UX design', 'UI design'],
      level: 'Medium',
    },
    {
      bg: 'bg-[#F9F5EC]',
      folderFill: '#7D794F',
      folderBack: '#C2BE93',
      badge: '10 lessons',
      tags: ['Design psychology', 'Visual design'],
      level: 'Junior',
    },
    {
      bg: 'bg-[#F2F4F7]',
      folderFill: '#4B5563',
      folderBack: '#9CA3AF',
      badge: '12 lessons',
      tags: ['Minimal UI design', 'Visual design'],
      level: 'Medium',
    },
    {
      bg: 'bg-[#EEF7FA]',
      folderFill: '#387B8A',
      folderBack: '#8EC1CD',
      badge: '20 lessons',
      tags: ['Interface design', 'Visual design'],
      level: 'Advance',
    },
    {
      bg: 'bg-[#F0F2FA]',
      folderFill: '#4A5B8C',
      folderBack: '#9CAAD1',
      badge: '16 lessons',
      tags: ['Behavior design', 'UX design'],
      level: 'Advance',
    },
  ];

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) => {
    if (filterStatus === 'PASSED') return lesson.hasPassed;
    if (filterStatus === 'PENDING') return !lesson.hasPassed;
    return true;
  });

  // Sort lessons
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    if (sortBy === 'SCORE') {
      return (b.bestScore || 0) - (a.bestScore || 0);
    }
    if (sortBy === 'TITLE') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return (a.dayNumber || 0) - (b.dayNumber || 0);
  });

  // Circular Mini Progress Ring (as seen in Dribbble screenshot)
  const CircularProgress = ({ percent = 0 }) => {
    const radius = 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <svg className="w-3.5 h-3.5 -rotate-90 flex-shrink-0" viewBox="0 0 16 16">
        <circle
          cx="8"
          cy="8"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="8"
          cy="8"
          r={radius}
          stroke="#10B981"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  };

  // 3D Pastel Folder Illustration (Matches the Dribbble vector folder illustration)
  const FolderIllustration = ({ theme, index }) => {
    // Variations: folder, card, document
    if (index % 4 === 3) {
      // "Get Started" minimal badge variation
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-2xs border border-black/5 text-[10px] font-bold text-gray-700">
          <span>Get Started</span>
          <span className="w-3.5 h-3.5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[8px]">
            &rarr;
          </span>
        </div>
      );
    }

    if (index % 4 === 1) {
      // Minimal search input card variation
      return (
        <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-white/90 shadow-2xs border border-black/5 w-28 text-[9px] text-gray-600 font-mono">
          <span>Design|</span>
          <span className="text-gray-400 text-[8px]">&times;</span>
        </div>
      );
    }

    // Default: Layered Folder with 3D drop shadow
    return (
      <div className="relative w-12 h-10 group-hover:scale-105 transition-transform duration-200">
        {/* Back folder flap */}
        <div
          className="absolute inset-0 rounded-lg shadow-xs"
          style={{ backgroundColor: theme.folderBack }}
        />
        {/* Front folder flap */}
        <div
          className="absolute inset-x-0 bottom-0 h-7 rounded-b-lg rounded-t-sm shadow-md"
          style={{ backgroundColor: theme.folderFill }}
        />
        {/* Tab top */}
        <div
          className="absolute top-0 left-1 w-5 h-2 rounded-t-md"
          style={{ backgroundColor: theme.folderBack }}
        />
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Page Title (Matches Dribbble screenshot "Courses") */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Courses
        </h1>

        {isAdmin && (
          <button
            onClick={onAddLesson}
            className="px-4 py-2 rounded-xl bg-[#d9be55] hover:bg-[#c4aa44] text-white text-xs font-bold transition shadow-xs"
          >
            + Thêm bài học mới
          </button>
        )}
      </div>

      {/* Sub-Header Controls Row: "All Courses 28", Filter, Sort by, View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Left: "All Courses 28" (With counter pill matching screenshot) */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-gray-900">All Courses</h2>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-extrabold text-xs">
            {lessons.length}
          </span>
        </div>

        {/* Right Controls: Filter, Sort by, Grid / List Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition shadow-2xs"
            >
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <span>
                {filterStatus === 'PASSED'
                  ? 'Đã đạt (>=8)'
                  : filterStatus === 'PENDING'
                  ? 'Chưa đạt'
                  : 'Filter'}
              </span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-30 text-xs font-medium space-y-1">
                <button
                  onClick={() => {
                    setFilterStatus('ALL');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    filterStatus === 'ALL'
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tất cả ({lessons.length})
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('PASSED');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    filterStatus === 'PASSED'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Đã đạt chuẩn (&gt;= 8)
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('PENDING');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    filterStatus === 'PENDING'
                      ? 'bg-amber-50 text-amber-800 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Chưa đạt / Chưa làm
                </button>
              </div>
            )}
          </div>

          {/* Sort By Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition shadow-2xs"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <span>
                {sortBy === 'SCORE'
                  ? 'Điểm số cao'
                  : sortBy === 'TITLE'
                  ? 'Theo tên'
                  : 'Sort by'}
              </span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-30 text-xs font-medium space-y-1">
                <button
                  onClick={() => {
                    setSortBy('DAY');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    sortBy === 'DAY'
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Theo ngày học
                </button>
                <button
                  onClick={() => {
                    setSortBy('SCORE');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    sortBy === 'SCORE'
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Điểm số cao nhất
                </button>
                <button
                  onClick={() => {
                    setSortBy('TITLE');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    sortBy === 'TITLE'
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tên bài học A-Z
                </button>
              </div>
            )}
          </div>

          {/* Grid vs List View Switcher (Matches black rounded square active state) */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Xem dạng lưới"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Xem dạng danh sách"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View Mode: 5-column responsive grid matching the Dribbble shot */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedLessons.map((lesson, idx) => {
            const theme = bannerThemes[idx % bannerThemes.length];
            const hasPassed = lesson.hasPassed;
            const bestScore = lesson.bestScore;
            const progressPercent = hasPassed
              ? 100
              : bestScore !== null && bestScore !== undefined
              ? Math.round((bestScore / 10) * 100)
              : 0;

            return (
              <div
                key={lesson._id}
                onClick={() => onSelectLesson && onSelectLesson(lesson)}
                className="bg-white rounded-2xl p-3 border border-gray-100/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:border-gray-200"
              >
                <div className="space-y-2.5">
                  {/* Thumbnail Banner with pastel bg, badge and 3D folder illustration */}
                  <div
                    className={`h-28 sm:h-32 w-full rounded-xl flex items-center justify-center relative overflow-hidden transition ${theme.bg}`}
                  >
                    {/* Top left badge: e.g. "14 lessons" or "Ngày 1" */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/85 backdrop-blur-xs text-[10px] font-bold text-gray-700 shadow-2xs">
                      Ngày {lesson.dayNumber}
                    </div>

                    {/* Status pill in top right corner */}
                    {hasPassed && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}

                    {/* Center 3D Minimal Illustration */}
                    <FolderIllustration theme={theme} index={idx} />
                  </div>

                  {/* Tags row: e.g. "UX design", "UI design" */}
                  <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                    <span>Google Form</span>
                    <span>&bull;</span>
                    <span>Chuẩn {lesson.passingScore || 8}/10</span>
                  </div>

                  {/* Title: 2 lines max, bold, crisp */}
                  <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-[#877028] transition-colors">
                    {lesson.title}
                  </h3>
                </div>

                {/* Footer Row: Level & Progress Circle (Matches Dribbble screenshot exactly) */}
                <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  {/* Left: Level */}
                  <div className="text-gray-400 font-medium">
                    Level:{' '}
                    <span className="font-bold text-gray-700">
                      {theme.level}
                    </span>
                  </div>

                  {/* Right: Progress with circular ring or "Not Started" */}
                  <div>
                    {hasPassed ? (
                      <div className="flex items-center gap-1 font-bold text-emerald-700">
                        <CircularProgress percent={100} />
                        <span>Đạt {bestScore}/10</span>
                      </div>
                    ) : bestScore !== null && bestScore !== undefined ? (
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <CircularProgress percent={progressPercent} />
                        <span>Progress: {progressPercent}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-semibold">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Mode */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {sortedLessons.map((lesson, idx) => {
            const theme = bannerThemes[idx % bannerThemes.length];
            const hasPassed = lesson.hasPassed;
            const bestScore = lesson.bestScore;

            return (
              <div
                key={lesson._id}
                onClick={() => onSelectLesson && onSelectLesson(lesson)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-14 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg}`}
                  >
                    <span className="font-extrabold text-xs text-gray-700">
                      N{lesson.dayNumber}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">
                      Ngày {lesson.dayNumber}: {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {lesson.description || 'Google Form bài kiểm tra trắc nghiệm'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
                    Mục tiêu &gt;= {lesson.passingScore || 8}/10
                  </span>
                  {hasPassed ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Đạt ({bestScore}/10)</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">
                      Not Started
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer: < Previous  1  2  3  4  5  ...  15  Next > (Matches Dribbble footer) */}
      <div className="flex items-center justify-center gap-1.5 pt-6 pb-2 text-xs font-semibold text-gray-500">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <button className="w-8 h-8 rounded-lg bg-gray-900 text-white font-bold flex items-center justify-center shadow-xs">
          1
        </button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition">
          2
        </button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition hidden sm:flex">
          3
        </button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition hidden sm:flex">
          4
        </button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition hidden sm:flex">
          5
        </button>
        <span className="px-1 text-gray-400">...</span>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition">
          {Math.max(1, Math.ceil(lessons.length / 10))}
        </button>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
