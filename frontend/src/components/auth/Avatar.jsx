import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'md' }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const name = user?.name || '?';
  const color = getAvatarColor(name);

  if (user?.avatar) {
    return <img src={user.avatar} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-surface-200`} />;
  }

  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-surface-200 flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
