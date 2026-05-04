import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import Avatar from '../components/auth/Avatar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getStatusColor, getPriorityColor, formatDate } from '../utils/helpers';
import {
  PlusIcon, TrashIcon, PencilIcon, UserPlusIcon, ArrowLeftIcon, SearchIcon
} from 'lucide-react';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProject = () => api.get(`/projects/${id}`).then(({ data }) => setProject(data.project));
  const fetchTasks = () => api.get(`/tasks/project/${id}`).then(({ data }) => setTasks(data.tasks));

  useEffect(() => {
    Promise.all([fetchProject(), fetchTasks(), api.get('/users').then(({ data }) => setAllUsers(data.users))])
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;
  const memberEntry = project?.members?.find((m) => (m.user?._id || m.user) === user?._id);
  const canEdit = isOwner || user?.role === 'admin' || memberEntry?.role === 'admin';

  const projectMembers = project
    ? [project.owner, ...project.members.map((m) => m.user)].filter(Boolean)
    : [];

  const handleAddMember = async () => {
    const found = allUsers.find((u) => u.email.toLowerCase() === addMemberEmail.toLowerCase().trim());
    if (!found) return toast.error('User not found with that email');
    try {
      await api.post(`/projects/${id}/members`, { userId: found._id, role: 'member' });
      toast.success(`${found.name} added to project`);
      setAddMemberEmail('');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and ALL its tasks? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const getTasksByStatus = (status) => filteredTasks.filter((t) => t.status === status);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading project...</div>
      </div>
    </Layout>
  );

  if (!project) return (
    <Layout>
      <div className="text-center py-24 text-gray-500">Project not found</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-4 transition-colors">
            <ArrowLeftIcon size={16} /> Back to projects
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <span className={`badge border ${getStatusColor(project.status)}`}>{project.status}</span>
                <span className={`badge border ${getPriorityColor(project.priority)}`}>{project.priority}</span>
              </div>
              {project.description && <p className="text-gray-500 text-sm">{project.description}</p>}
              {project.deadline && <p className="text-xs text-gray-600 mt-1">Deadline: {formatDate(project.deadline)}</p>}
            </div>

            <div className="flex gap-2">
              {canEdit && (
                <>
                  <button onClick={() => setShowProjectForm(true)} className="btn-secondary">
                    <PencilIcon size={14} /> Edit
                  </button>
                  <button onClick={handleDeleteProject} className="btn-danger">
                    <TrashIcon size={14} /> Delete
                  </button>
                </>
              )}
              <button onClick={() => setShowTaskForm(true)} className="btn-primary">
                <PlusIcon size={14} /> Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Kanban Board */}
          <div className="xl:col-span-3">
            {/* Search */}
            <div className="relative mb-4 max-w-xs">
              <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="input pl-9" placeholder="Search tasks..." value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUMNS.map((col) => {
                const colTasks = getTasksByStatus(col.key);
                return (
                  <div key={col.key} className="bg-surface-50 rounded-xl border border-surface-200 p-4 min-h-[300px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{col.label}</h3>
                      <span className="text-xs bg-surface-200 text-gray-400 rounded-full px-2 py-0.5">{colTasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colTasks.map((task) => (
                        <div key={task._id} className="relative group">
                          <TaskCard task={task} onClick={() => setEditTask(task)} />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                          >
                            <TrashIcon size={12} />
                          </button>
                        </div>
                      ))}
                      {colTasks.length === 0 && (
                        <p className="text-xs text-gray-700 text-center py-6">No tasks</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Team Members */}
          <div className="xl:col-span-1 space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Team Members</h3>

              {/* Owner */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-200">
                <Avatar user={project.owner} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{project.owner?.name}</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
              </div>

              {/* Members */}
              <div className="space-y-2 mb-4">
                {project.members.map((m) => (
                  <div key={m.user?._id} className="flex items-center gap-3 group">
                    <Avatar user={m.user} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{m.user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => handleRemoveMember(m.user?._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                      >
                        <TrashIcon size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {project.members.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-2">No members yet</p>
                )}
              </div>

              {/* Add member */}
              {canEdit && (
                <div>
                  <label className="label">Add by email</label>
                  <div className="flex gap-2">
                    <input className="input flex-1 text-xs" placeholder="user@email.com"
                      value={addMemberEmail} onChange={(e) => setAddMemberEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMember()} />
                    <button onClick={handleAddMember} className="btn-primary px-2.5" title="Add member">
                      <UserPlusIcon size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge bg-surface-200 text-gray-400 border border-surface-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showTaskForm || editTask) && (
        <TaskForm
          task={editTask}
          projectId={id}
          projectMembers={projectMembers}
          onClose={() => { setShowTaskForm(false); setEditTask(null); }}
          onSave={(saved) => {
            fetchTasks();
          }}
        />
      )}

      {showProjectForm && (
        <ProjectForm
          project={project}
          onClose={() => setShowProjectForm(false)}
          onSave={(updated) => setProject(updated)}
        />
      )}
    </Layout>
  );
};

export default ProjectDetail;
