import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { DribbbleAppShell } from './components/DribbbleAppShell';
import { CalendarScheduleView } from './components/CalendarScheduleView';
import { CoursesGridView } from './components/CoursesGridView';
import { AssignmentsView } from './components/AssignmentsView';
import { StatisticsView } from './components/StatisticsView';
import { Login } from './pages/Login';
import { AdminLessons } from './pages/AdminLessons';
import { AdminStudents } from './pages/AdminStudents';
import { AdminSubmissions } from './pages/AdminSubmissions';
import { AdminGuide } from './pages/AdminGuide';
import { LessonDetailModal } from './components/LessonDetailModal';
import { GoogleFormSimulatorModal } from './components/GoogleFormSimulatorModal';

export const App = () => {
  const { user, loading, isAdmin } = useAuth();
  // Default to 'calendar' as shown in the Dribbble design screenshot
  const [activeTab, setActiveTab] = useState('calendar');
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lessons, setLessons] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [checkingLessonId, setCheckingLessonId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch lessons & submissions
  const fetchData = async () => {
    try {
      const [lessonsRes, subsRes] = await Promise.all([
        api.lessons.getAll(),
        isAdmin ? api.submissions.getAll() : api.submissions.getMySubmissions(),
      ]);

      if (lessonsRes.success) setLessons(lessonsRes.lessons);
      if (subsRes.success) setSubmissions(subsRes.submissions);
    } catch (err) {
      console.error('Error fetching data in App:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, isAdmin, refreshTrigger]);

  // Quick check Google Form score for a lesson
  const handleCheckScore = async (lesson) => {
    setCheckingLessonId(lesson._id);
    try {
      const data = await api.submissions.checkGoogleForm(lesson._id);
      alert(data.message || 'Kiểm tra điểm Google Form thành công!');
      if (data.isPassed) {
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      alert(err.message || 'Không thể kiểm tra điểm lúc này.');
    } finally {
      setCheckingLessonId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6D743] flex flex-col items-center justify-center text-gray-900 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center font-black text-2xl text-[#d9be55] animate-pulse">
          K
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-900">
          Đang tải Khôi LMS...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Filter lessons based on search query
  const filteredLessons = lessons.filter((lesson) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lesson.title?.toLowerCase().includes(q) ||
      lesson.formId?.toLowerCase().includes(q) ||
      lesson.description?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <DribbbleAppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => setSimulatorOpen(true)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      >
        {/* Render Tab Contents */}
        {activeTab === 'calendar' && (
          <CalendarScheduleView
            lessons={filteredLessons}
            submissions={submissions}
            onOpenSimulator={(les) => setSimulatorOpen(true)}
            onCheckScore={handleCheckScore}
            checkingLessonId={checkingLessonId}
          />
        )}

        {activeTab === 'courses' && (
          isAdmin ? (
            <AdminLessons />
          ) : (
            <CoursesGridView
              lessons={filteredLessons}
              isAdmin={isAdmin}
              onSelectLesson={(les) => setSelectedLesson(les)}
              onAddLesson={() => setActiveTab('courses')}
              onOpenSimulator={() => setSimulatorOpen(true)}
            />
          )
        )}

        {activeTab === 'assignments' && (
          isAdmin ? (
            <AdminSubmissions />
          ) : (
            <AssignmentsView
              submissions={submissions}
              onOpenSimulator={() => setSimulatorOpen(true)}
            />
          )
        )}

        {activeTab === 'statistics' && (
          isAdmin ? (
            <AdminStudents />
          ) : (
            <StatisticsView
              user={user}
              lessons={lessons}
              submissions={submissions}
            />
          )
        )}

        {activeTab === 'settings' && (
          <AdminGuide onOpenSimulator={() => setSimulatorOpen(true)} />
        )}
      </DribbbleAppShell>

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        lesson={selectedLesson}
        isOpen={Boolean(selectedLesson)}
        onClose={() => setSelectedLesson(null)}
        onOpenSimulator={(les) => {
          setSelectedLesson(null);
          setSimulatorOpen(true);
        }}
        onScoreUpdated={() => setRefreshTrigger((prev) => prev + 1)}
      />

      {/* Simulator Modal for testing 8/10 rule */}
      <GoogleFormSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        lessons={lessons}
        onSubmitted={() => {
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </>
  );
};
