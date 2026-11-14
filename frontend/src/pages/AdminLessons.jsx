import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Plus, Edit2, Trash2, ExternalLink, X, BookOpen, Search, Lock, Unlock } from 'lucide-react';

export const AdminLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const [formData, setFormData] = useState({
    dayNumber: 1,
    title: '',
    description: '',
    content: '',
    googleFormUrl: '',
    formId: '',
    passingScore: 8,
    maxScore: 10,
    unlockedSolution: '',
    unlockedDriveLink: '',
  });

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await api.lessons.getAll();
      if (data.success) {
        setLessons(data.lessons);
      }
    } catch (err) {
      console.error('Fetch lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openCreateModal = () => {
    const nextDay = lessons.length > 0 ? Math.max(...lessons.map((l) => l.dayNumber)) + 1 : 1;
    setEditingLesson(null);
    setFormData({
      dayNumber: nextDay,
      title: '',
      description: '',
      content: '',
      googleFormUrl: '',
      formId: `DAY_${nextDay}_FORM`,
      passingScore: 8,
      maxScore: 10,
      unlockedSolution: '',
      unlockedDriveLink: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      dayNumber: lesson.dayNumber,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      googleFormUrl: lesson.googleFormUrl || '',
      formId: lesson.formId || `DAY_${lesson.dayNumber}_FORM`,
      passingScore: lesson.passingScore || 8,
      maxScore: lesson.maxScore || 10,
      unlockedSolution: lesson.unlockedSolution || '',
      unlockedDriveLink: lesson.unlockedDriveLink || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.lessons.update(editingLesson._id, formData);
      } else {
        await api.lessons.create(formData);
      }
      setModalOpen(false);
      fetchLessons();
    } catch (err) {
      alert(err.message || 'Lỗi lưu bài học');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${title}"?`)) {
      try {
        await api.lessons.delete(id);
        fetchLessons();
      } catch (err) {
        alert(err.message || 'Lỗi xóa bài học');
      }
    }
  };

  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(filterText.toLowerCase()) ||
      l.formId.toLowerCase().includes(filterText.toLowerCase()) ||
      `ngày ${l.dayNumber}`.includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Full-Width Top Bar */}
      <div className="fb-card p-4 sm:p-5 border border-[#CED0D4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#050505]">
              Giáo trình bài học &amp; Google Form
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f7f4e8] text-[#877028]">
              {lessons.length} ngày học
            </span>
          </div>
          <p className="text-xs text-[#65676B] mt-0.5">
            Cấu hình liên kết Google Form, điểm đạt chuẩn (8/10) và nội dung lời giải chi tiết ẩn
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick search input */}
          <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-2 text-xs text-[#65676B] w-48 sm:w-60">
            <Search className="h-3.5 w-3.5 text-[#65676B]" />
            <input
              type="text"
              placeholder="Lọc bài học hoặc mã form..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[#050505] w-full"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="fb-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 flex-shrink-0 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm ngày học</span>
          </button>
        </div>
      </div>

      {/* Full-Width Lessons Table / Grid */}
      <div className="fb-card border border-[#CED0D4]/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F2F5] text-[#65676B] font-bold border-b border-[#CED0D4]">
              <tr>
                <th className="py-3 px-4 w-20">Ngày</th>
                <th className="py-3 px-4">Tên bài học &amp; Nội dung</th>
                <th className="py-3 px-4 w-40">Mã Form &amp; Link</th>
                <th className="py-3 px-4 w-28">Điểm chuẩn</th>
                <th className="py-3 px-4 min-w-[200px]">Lời giải độc quyền (Bị ẩn nếu &lt; 8)</th>
                <th className="py-3 px-4 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6EB] text-[#050505]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#65676B]">
                    Đang tải danh sách bài học...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#65676B]">
                    Không tìm thấy bài học nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-[#F0F2F5]/60 transition">
                    {/* Day Pill */}
                    <td className="py-4 px-4 align-top">
                      <span className="px-2.5 py-1 rounded-md bg-[#f7f4e8] text-[#877028] font-bold text-xs inline-block">
                        Ngày {lesson.dayNumber}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <p className="font-bold text-[#050505] text-sm">{lesson.title}</p>
                      <p className="text-xs text-[#65676B] mt-1 leading-relaxed whitespace-pre-line">
                        {lesson.description || lesson.content}
                      </p>
                    </td>

                    {/* Form ID & Link */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-mono text-xs font-semibold text-[#050505] block">
                        {lesson.formId}
                      </span>
                      {lesson.googleFormUrl ? (
                        <a
                          href={lesson.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#877028] hover:underline inline-flex items-center gap-1 font-semibold text-xs mt-1"
                        >
                          <span>Mở Form</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-[#65676B] text-[11px]">Chưa gắn link</span>
                      )}
                    </td>

                    {/* Passing Score */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-bold text-xs text-[#877028] bg-[#f7f4e8] px-2 py-0.5 rounded">
                        {lesson.passingScore}/10 điểm
                      </span>
                    </td>

                    {/* Solution Preview (No text slicing, full line breaks preserved) */}
                    <td className="py-4 px-4 align-top min-w-[300px] max-w-md">
                      {lesson.unlockedSolution ? (
                        <div className="space-y-1.5">
                          <div
                            className={`p-2.5 rounded-lg bg-[#F0F2F5] border border-[#CED0D4] text-xs font-mono text-[#050505] whitespace-pre-wrap leading-relaxed ${
                              expandedSolutions[lesson._id]
                                ? 'max-h-none'
                                : 'max-h-28 overflow-y-auto'
                            }`}
                          >
                            {lesson.unlockedSolution}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedSolutions((prev) => ({
                                ...prev,
                                [lesson._id]: !prev[lesson._id],
                              }))
                            }
                            className="text-[11px] text-[#877028] hover:underline font-semibold block"
                          >
                            {expandedSolutions[lesson._id]
                              ? '▲ Thu gọn'
                              : '▼ Xem đầy đủ lời giải'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#65676B] text-[11px] italic">
                          (Chưa có lời giải chi tiết)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="fb-btn-secondary px-2.5 py-1 text-xs"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id, lesson.title)}
                          className="fb-btn-light px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-[#FFEBE8]"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-[#CED0D4] relative text-[#050505] max-h-[88vh] flex flex-col">
            <div className="px-4 py-3 border-b border-[#E4E6EB] flex items-center justify-between flex-shrink-0">
              <h3 className="text-base font-bold text-[#050505]">
                {editingLesson ? `Chỉnh sửa Ngày ${formData.dayNumber}` : 'Thêm bài học mới'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#65676B]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto pr-2 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#050505] mb-1">Thứ tự ngày (dayNumber):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.dayNumber}
                    onChange={(e) => setFormData({ ...formData, dayNumber: Number(e.target.value) })}
                    className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#050505] mb-1">Mã Form (formId):</label>
                  <input
                    type="text"
                    required
                    value={formData.formId}
                    onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
                    className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] font-mono focus:outline-none focus:border-[#d9be55]"
                    placeholder="DAY_1_FORM"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#050505] mb-1">Tiêu đề bài học:</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  placeholder="Ngày 1: Async/Await & Event Loop"
                />
              </div>

              <div>
                <label className="block font-bold text-[#050505] mb-1">Link Google Form:</label>
                <input
                  type="url"
                  value={formData.googleFormUrl}
                  onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })}
                  className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  placeholder="https://docs.google.com/forms/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#050505] mb-1">Điểm chuẩn để mở khóa (mặc định 8):</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#877028] font-bold focus:outline-none focus:border-[#d9be55]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#050505] mb-1">Thang điểm tối đa:</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                    className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#050505] mb-1">Nội dung bài học / Hướng dẫn:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg p-3 text-[#050505] text-xs focus:outline-none focus:border-[#d9be55]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E7E34] mb-1">
                  Lời giải chi tiết độc quyền (Chỉ mở khi điểm &gt;= {formData.passingScore}/10):
                </label>
                <textarea
                  rows={3}
                  value={formData.unlockedSolution}
                  onChange={(e) => setFormData({ ...formData, unlockedSolution: e.target.value })}
                  className="w-full bg-[#E4F8EA]/30 border border-[#B7EB8F] rounded-lg p-3 text-[#050505] text-xs font-mono focus:outline-none focus:border-[#42B72A]"
                  placeholder="Đáp án và giải thích chi tiết..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#050505] mb-1">Link Drive lời giải (tùy chọn):</label>
                <input
                  type="url"
                  value={formData.unlockedDriveLink}
                  onChange={(e) => setFormData({ ...formData, unlockedDriveLink: e.target.value })}
                  className="w-full bg-[#F0F2F5] border border-[#CED0D4] rounded-lg px-3 py-2 text-[#050505] focus:outline-none focus:border-[#d9be55]"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="pt-3 border-t border-[#E4E6EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="fb-btn-secondary px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="fb-btn-primary px-4 py-2"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
