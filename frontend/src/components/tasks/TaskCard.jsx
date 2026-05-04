import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../auth/Avatar';
import { getPriorityColor, getStatusColor, formatDate, isOverdue } from '../../utils/helpers';
import { CalendarIcon, AlertCircleIcon } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const overdue = isOverdue(task.deadline, task.status);

  return (
    <div
      onClick={onClick}
      className="card p-4 hover:border-brand-500/30 cursor-pointer transition-all duration-200 group animate-slide-up"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span className={`badge border ${getPriorityColor(task.priority)} flex-shrink-0`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <span className={`badge border ${getStatusColor(task.status)}`}>
          {task.status === 'in-progress' ? 'In Progress' : task.status}
        </span>

        <div className="flex items-center gap-2">
          {task.deadline && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-gray-500'}`}>
              {overdue && <AlertCircleIcon size={12} />}
              <CalendarIcon size={12} />
              {formatDate(task.deadline)}
            </span>
          )}
          {task.assignedTo && <Avatar user={task.assignedTo} size="sm" />}
        </div>
      </div>

      {task.project && (
        <p className="text-xs text-gray-600 mt-2 font-mono">{task.project.name}</p>
      )}
    </div>
  );
};

export default TaskCard;
