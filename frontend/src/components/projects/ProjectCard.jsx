import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../auth/Avatar';
import { getStatusColor, getPriorityColor, formatDate } from '../../utils/helpers';
import { CalendarIcon, CheckCircleIcon, UsersIcon } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { taskCounts } = project;
  const progress = taskCounts?.total > 0 ? Math.round((taskCounts.done / taskCounts.total) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="card p-5 hover:border-brand-500/30 cursor-pointer transition-all duration-200 group animate-slide-up"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <span className={`badge border ${getPriorityColor(project.priority)}`}>{project.priority}</span>
          <span className={`badge border ${getStatusColor(project.status)}`}>{project.status}</span>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircleIcon size={13} />
            {taskCounts?.done || 0}/{taskCounts?.total || 0} tasks
          </span>
          {project.deadline && (
            <span className="flex items-center gap-1">
              <CalendarIcon size={13} />
              {formatDate(project.deadline)}
            </span>
          )}
        </div>
        <div className="flex -space-x-2">
          <Avatar user={project.owner} size="sm" />
          {project.members?.slice(0, 3).map((m) => (
            <Avatar key={m.user?._id || m._id} user={m.user || m} size="sm" />
          ))}
          {project.members?.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-surface-200 ring-2 ring-surface-200 flex items-center justify-center text-xs text-gray-400">
              +{project.members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
