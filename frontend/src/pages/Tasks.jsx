import React, { useEffect, useState } from 'react';
import Layout from '../components/dashboard/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import api from '../utils/api';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', overdue: '' });

  const fetchTasks = () => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.overdue) params.set('overdue', 'true');
    api.get(`/tasks?${params}`).then(({ data }) => setTasks(data.tasks)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, [filters]);

  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} tasks</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <PlusIcon size={16} /> New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className="input pl-9" placeholder="Search tasks..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>

          <select className="input max-w-[140px]" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <select className="input max-w-[140px]" value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button
            onClick={() => setFilters({ ...filters, overdue: filters.overdue ? '' : 'true' })}
            className={`btn text-sm ${filters.overdue ? 'btn-danger' : 'btn-secondary'}`}
          >
            Overdue Only
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-40 animate-pulse bg-surface-100" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((task) => (
              <TaskCard key={task._id} task={task} onClick={() => setEditTask(task)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-500 mb-4">No tasks found</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <PlusIcon size={16} /> Create Task
            </button>
          </div>
        )}

        {(showForm || editTask) && (
          <TaskForm
            task={editTask}
            onClose={() => { setShowForm(false); setEditTask(null); }}
            onSave={() => fetchTasks()}
          />
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
