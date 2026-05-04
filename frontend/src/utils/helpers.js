import { formatDistanceToNow, format, isPast } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date) => {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (deadline, status) => {
  if (!deadline || status === 'done') return false;
  return isPast(new Date(deadline));
};

export const getPriorityColor = (priority) => {
  const map = {
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    low: 'text-green-400 bg-green-400/10 border-green-400/20',
  };
  return map[priority] || map.medium;
};

export const getStatusColor = (status) => {
  const map = {
    todo: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    'in-progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    review: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    done: 'text-green-400 bg-green-400/10 border-green-400/20',
    active: 'text-green-400 bg-green-400/10 border-green-400/20',
    completed: 'text-brand-400 bg-brand-400/10 border-brand-400/20',
    'on-hold': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return map[status] || map.todo;
};

export const getStatusDot = (status) => {
  const map = {
    todo: 'bg-gray-400',
    'in-progress': 'bg-blue-400',
    review: 'bg-purple-400',
    done: 'bg-green-400',
  };
  return map[status] || 'bg-gray-400';
};

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const avatarColors = [
  'bg-brand-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600',
  'bg-teal-600', 'bg-cyan-600', 'bg-lime-600', 'bg-rose-600',
];

export const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};
