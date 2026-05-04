import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = 'brand', sub }) => {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-400/10',
    green: 'text-green-400 bg-green-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    red: 'text-red-400 bg-red-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
  };

  return (
    <div className="card p-5 flex items-start justify-between gap-4 hover:border-surface-100 transition-colors">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-semibold text-white">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className={`${colorMap[color]} rounded-xl p-3 flex-shrink-0`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
