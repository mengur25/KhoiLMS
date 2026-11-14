import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { CheckCircle2, Circle, Plus, Trash2, Target } from 'lucide-react';

export const DailyGoalsWidget = ({ refreshTrigger }) => {
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await api.goals.getGoals();
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [refreshTrigger]);

  const handleToggle = async (goalId) => {
    setGoals((prev) =>
      prev.map((g) => (g._id === goalId ? { ...g, isCompleted: !g.isCompleted } : g))
    );

    try {
      await api.goals.toggle(goalId);
    } catch (err) {
      console.error('Toggle error:', err);
      fetchGoals();
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    setAdding(true);
    try {
      const data = await api.goals.create(newGoalTitle.trim());
      if (data.success) {
        setGoals((prev) => [...prev, data.goal]);
        setNewGoalTitle('');
      }
    } catch (err) {
      console.error('Create goal error:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (goalId) => {
    setGoals((prev) => prev.filter((g) => g._id !== goalId));
    try {
      await api.goals.delete(goalId);
    } catch (err) {
      console.error('Delete goal error:', err);
      fetchGoals();
    }
  };

  const completedCount = goals.filter((g) => g.isCompleted).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="card-clean p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Mục tiêu học hôm nay
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {completedCount}/{goals.length} ({progressPercent}%)
        </span>
      </div>

      {/* Clean progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Goals list */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-4 text-xs text-slate-400">Đang tải mục tiêu...</div>
        ) : goals.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">Chưa có mục tiêu nào.</div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal._id}
              onClick={() => handleToggle(goal._id)}
              className={`flex items-center justify-between p-2 rounded-lg border transition cursor-pointer group text-xs ${
                goal.isCompleted
                  ? 'bg-slate-50 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {goal.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                )}
                <span className={`truncate ${goal.isCompleted ? 'line-through' : ''}`}>
                  {goal.title}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(goal._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition ml-2"
                title="Xóa"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add goal */}
      <form onSubmit={handleAddGoal} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          placeholder="Thêm mục tiêu cá nhân..."
          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={adding || !newGoalTitle.trim()}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 transition disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm
        </button>
      </form>
    </div>
  );
};
