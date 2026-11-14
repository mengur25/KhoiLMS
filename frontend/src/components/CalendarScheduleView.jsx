import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  CheckCircle,
  Lock,
  FileText,
  AlertCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const CalendarScheduleView = ({
  lessons = [],
  submissions = [],
  onOpenSimulator,
  onCheckScore,
  checkingLessonId,
}) => {
  // Select default lesson to show in the floating detail card (like G2 Homework 01 in screenshot)
  const [selectedLessonId, setSelectedLessonId] = useState(
    lessons[0]?._id || null
  );

  const selectedLesson =
    lessons.find((l) => l._id === selectedLessonId) || lessons[0];

  // Days of the week (matches 6 MON, 7 TUE, 8 WED, 9 THU, 10 FRI, 11 SAT, 12 SUN)
  const weekDays = [
    { dayNumber: 6, dayName: 'MON', label: 'Thứ 2', date: '6' },
    { dayNumber: 7, dayName: 'TUE', label: 'Thứ 3', date: '7' },
    { dayNumber: 8, dayName: 'WED', label: 'Thứ 4', date: '8' },
    { dayNumber: 9, dayName: 'THU', label: 'Thứ 5', date: '9' },
    { dayNumber: 10, dayName: 'FRI', label: 'Thứ 6', date: '10' },
    { dayNumber: 11, dayName: 'SAT', label: 'Thứ 7', date: '11' },
    { dayNumber: 12, dayName: 'SUN', label: 'Chủ nhật', date: '12' },
  ];

  // Time slots for the calendar grid
  const timeSlots = [
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
  ];

  // Map each lesson to a calendar day & hour slot matching the Dribbble layout
  const getLessonCalendarSlot = (index) => {
    switch (index) {
      case 0:
        return {
          dayIndex: 0, // MON
          time: '9:30 AM',
          topOffset: '24px',
          height: '68px',
          colorStyle:
            'bg-[#FEF8DB] text-[#856B10] border-[#FAE99E] hover:bg-[#FDF3C4]',
          tagBg: 'bg-[#FDF3C4] text-[#856B10]',
          tagLabel: 'Test',
        };
      case 1:
        return {
          dayIndex: 1, // TUE
          time: '10 AM',
          topOffset: '75px',
          height: '74px',
          colorStyle:
            'bg-[#F4EFFE] text-[#6D44B8] border-[#E5D8FD] hover:bg-[#ECE2FC]',
          tagBg: 'bg-[#ECE2FC] text-[#6D44B8]',
          tagLabel: 'Session',
        };
      case 2:
        return {
          dayIndex: 1, // TUE
          time: '1 PM',
          topOffset: '270px',
          height: '68px',
          colorStyle:
            'bg-[#F4EFFE] text-[#6D44B8] border-[#E5D8FD] hover:bg-[#ECE2FC]',
          tagBg: 'bg-[#ECE2FC] text-[#6D44B8]',
          tagLabel: 'Session',
        };
      case 3:
        return {
          dayIndex: 3, // THU
          time: '1 PM',
          topOffset: '270px',
          height: '68px',
          colorStyle:
            'bg-[#F4EFFE] text-[#6D44B8] border-[#E5D8FD] hover:bg-[#ECE2FC]',
          tagBg: 'bg-[#ECE2FC] text-[#6D44B8]',
          tagLabel: 'Session',
        };
      case 4:
      default:
        return {
          dayIndex: 4, // FRI
          time: '9 AM',
          topOffset: '10px',
          height: '74px',
          colorStyle:
            'bg-[#E7F8FB] text-[#1C788A] border-[#C6EDF4] hover:bg-[#D8F3F7]',
          tagBg: 'bg-[#D8F3F7] text-[#1C788A]',
          tagLabel: 'Task',
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Calendar Title & Date Picker Row (matches Dribbble header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Calendar
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
            Lộ trình học tập &amp; Lịch kiểm tra trắc nghiệm Google Form theo ngày
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200/70 text-xs sm:text-sm font-semibold text-gray-700">
            <span>November 2026</span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={() => onOpenSimulator && onOpenSimulator(selectedLesson)}
            className="px-3.5 py-2 rounded-xl bg-[#d9be55] hover:bg-[#c4aa44] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            title="Thử nghiệm điểm số Google Form (Test quy tắc 8/10)"
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>Mô phỏng điểm 8/10</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Board with Days row & Timeline Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs relative">
        {/* Days Header Row with < and > arrows */}
        <div className="grid grid-cols-8 border-b border-gray-100 bg-white items-center text-center text-xs">
          {/* Top Left Navigation Arrow */}
          <div className="py-4 border-r border-gray-100 flex items-center justify-center">
            <button className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* 7 Days of the Week */}
          {weekDays.map((d, idx) => (
            <div
              key={d.dayNumber}
              className={`py-3.5 px-2 border-r last:border-r-0 border-gray-100 ${
                idx === 0 ? 'bg-amber-50/20' : ''
              }`}
            >
              <div className="font-extrabold text-base text-gray-900">
                {d.dayNumber}
              </div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {d.dayName}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid with Hourly Rows & Event Cards */}
        <div className="relative min-h-[520px] bg-white">
          {/* Grid Background: Hour Rows */}
          <div className="divide-y divide-gray-100/80 text-xs">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 h-16 items-start">
                {/* Hour label */}
                <div className="pt-2 pr-3 text-right font-medium text-gray-400 text-[11px] select-none border-r border-gray-100">
                  {time}
                </div>
                {/* 7 day cells */}
                {weekDays.map((d) => (
                  <div
                    key={d.dayNumber}
                    className="h-full border-r last:border-r-0 border-gray-100/60"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Interactive Lesson Cards overlay on the grid */}
          <div className="absolute inset-0 left-[12.5%] grid grid-cols-7 pointer-events-none">
            {lessons.map((lesson, idx) => {
              const slot = getLessonCalendarSlot(idx);
              const isSelected = selectedLesson?._id === lesson._id;
              const hasPassed = lesson.hasPassed;
              const isLocked = lesson.isLocked;

              // Grid column offset
              const colStart = slot.dayIndex + 1;

              return (
                <div
                  key={lesson._id}
                  style={{ gridColumnStart: colStart }}
                  className="relative pointer-events-auto px-1.5"
                >
                  <div
                    onClick={() => setSelectedLessonId(lesson._id)}
                    style={{
                      top: slot.topOffset,
                      minHeight: slot.height,
                    }}
                    className={`absolute left-1 right-1 rounded-xl p-2.5 border transition cursor-pointer shadow-2xs select-none ${
                      hasPassed
                        ? 'bg-[#E7F8EC] text-[#1E7E34] border-[#B7EB8F]'
                        : isLocked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                        : slot.colorStyle
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#d9be55] shadow-md scale-[1.02]'
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs truncate">
                        {lesson.title || `Ngày ${lesson.dayNumber}`}
                      </span>
                      {hasPassed && (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isLocked && (
                        <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="text-[10px] opacity-75 font-medium mt-0.5">
                      {slot.time}
                    </div>

                    <div className="mt-1.5 flex items-center gap-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          hasPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : slot.tagBg
                        }`}
                      >
                        {hasPassed ? 'Đã đạt' : slot.tagLabel}
                      </span>
                      <span className="text-[9px] opacity-70">
                        {hasPassed
                          ? `${lesson.bestScore}/10`
                          : `Chuẩn ${lesson.passingScore || 8}/10`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Detail Card (Exact copy of the Dribbble popover card) */}
          {selectedLesson && (
            <div className="absolute right-4 top-16 z-20 w-80 max-w-[90%] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 space-y-4 animate-in fade-in duration-200">
              {/* Card Header with vertical accent line */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#d9be55] rounded-full" />
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight leading-snug">
                    Ngày {selectedLesson.dayNumber}: {selectedLesson.title}
                  </h3>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Description
                </span>
                <p className="text-xs text-gray-600 leading-relaxed max-h-28 overflow-y-auto pr-1">
                  {selectedLesson.description ||
                    selectedLesson.content ||
                    'Hoàn thành bài kiểm tra trắc nghiệm trên Google Form để tự động mở khóa lời giải chi tiết theo quy tắc điểm >= 8/10.'}
                </p>
              </div>

              {/* Tags Row: Task & Urgent */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-semibold text-[11px]">
                  <FileText className="h-3 w-3 text-gray-400" />
                  <span>Google Form</span>
                </span>

                {selectedLesson.hasPassed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>Đạt chuẩn ({selectedLesson.bestScore}/10)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#856b10] font-bold text-[11px]">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                    <span>Mục tiêu &gt;= {selectedLesson.passingScore || 8}/10</span>
                  </span>
                )}
              </div>

              {/* Unlocked Solution preview if student achieved >= 8/10 */}
              {selectedLesson.hasPassed && selectedLesson.unlockedSolution && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-emerald-800 font-bold text-[11px]">
                    <span>Lời giải chi tiết (Đã mở khóa)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Chuẩn 8/10
                    </span>
                  </div>
                  <div className="max-h-24 overflow-y-auto bg-white p-2.5 rounded-lg border border-emerald-100 font-mono text-[11px] text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedLesson.unlockedSolution}
                  </div>
                  {selectedLesson.unlockedDriveLink && (
                    <a
                      href={selectedLesson.unlockedDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Link Drive bài giảng &amp; Video</span>
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons: Large Primary Button ATTACH FILES / LÀM BÀI FORM */}
              <div className="space-y-2 pt-1">
                {selectedLesson.googleFormUrl ? (
                  <a
                    href={selectedLesson.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#d9be55] hover:bg-[#c4aa44] text-white font-extrabold text-xs uppercase tracking-wider text-center transition shadow-xs flex items-center justify-center gap-1.5 block"
                  >
                    <span>Làm bài Google Form</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-gray-200 text-gray-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed text-center"
                  >
                    Chưa gắn link Form
                  </button>
                )}

                {/* Secondary Check Button */}
                <button
                  onClick={() => onCheckScore && onCheckScore(selectedLesson)}
                  disabled={checkingLessonId === selectedLesson._id}
                  className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs text-center transition flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="h-3.5 w-3.5 text-gray-500" />
                  <span>
                    {checkingLessonId === selectedLesson._id
                      ? 'Đang kiểm tra kết quả...'
                      : 'Kiểm tra điểm từ Webhook'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
