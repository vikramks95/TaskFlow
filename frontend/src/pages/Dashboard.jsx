import React, { useEffect, useState } from 'react';
import Layout from '../components/dashboard/Layout';
import StatCard from '../components/dashboard/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FolderIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon, ZapIcon } from 'lucide-react';
import { formatRelative, getStatusColor } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/dashboard').then(({ data }) => {
      setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  const getCount = (status) => stats?.tasksByStatus?.find((s) => s._id === status)?.count || 0;

  const totalTasks = stats?.tasksByStatus?.reduce((s, i) => s + i.count, 0) || 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Good morning, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening across your projects</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-24 animate-pulse bg-surface-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Projects" value={stats?.projects} icon={FolderIcon} color="brand" />
            <StatCard label="Total Tasks" value={totalTasks} icon={ZapIcon} color="blue" />
            <StatCard label="Completed" value={getCount('done')} icon={CheckCircleIcon} color="green" sub={`${totalTasks > 0 ? Math.round((getCount('done') / totalTasks) * 100) : 0}% of all tasks`} />
            <StatCard label="Overdue" value={stats?.overdueTasks} icon={AlertCircleIcon} color="red" />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Task Status Breakdown */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <ClockIcon size={18} className="text-brand-400" />
              Task Breakdown
            </h2>
            {['todo', 'in-progress', 'review', 'done'].map((status) => {
              const count = getCount(status);
              const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              return (
                <div key={status} className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`badge border ${getStatusColor(status)}`}>
                      {status === 'in-progress' ? 'In Progress' : status}
                    </span>
                    <span className="text-gray-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* My Tasks */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircleIcon size={18} className="text-brand-400" />
              My Upcoming Tasks
            </h2>
            <div className="space-y-2">
              {stats?.myTasks?.length > 0 ? (
                stats.myTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between py-2 border-b border-surface-200 last:border-0">
                    <div>
                      <p className="text-sm text-gray-300 line-clamp-1">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.project?.name}</p>
                    </div>
                    <span className={`badge border ${getStatusColor(task.status)} text-xs flex-shrink-0`}>
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No pending tasks 🎉</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <ZapIcon size={18} className="text-brand-400" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {stats?.recentTasks?.length > 0 ? (
                stats.recentTasks.slice(0, 6).map((task) => (
                  <div key={task._id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 line-clamp-1">{task.title}</p>
                      <p className="text-xs text-gray-600">{task.project?.name} · {formatRelative(task.updatedAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
