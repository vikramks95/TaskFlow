import React, { useEffect, useState } from 'react';
import Layout from '../components/dashboard/Layout';
import Avatar from '../components/auth/Avatar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Team = () => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users').then(({ data }) => setMembers(data.users)).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      setMembers((prev) => prev.map((m) => m._id === userId ? { ...m, role } : m));
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} members in your workspace</p>
        </div>

        <div className="relative mb-6 max-w-sm">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9" placeholder="Search members..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-surface-100" />)}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  {currentUser?.role === 'admin' && (
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {filtered.map((member) => (
                  <tr key={member._id} className="hover:bg-surface-100 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={member} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-200">{member.name}</p>
                          {member._id === currentUser?._id && (
                            <p className="text-xs text-brand-400">You</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge border ${member.role === 'admin' ? 'text-brand-400 bg-brand-400/10 border-brand-400/20' : 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                        {member.role === 'admin' ? <ShieldIcon size={11} /> : <UserIcon size={11} />}
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(member.createdAt)}</td>
                    {currentUser?.role === 'admin' && (
                      <td className="px-6 py-4">
                        {member._id !== currentUser?._id && (
                          <select
                            className="input max-w-[120px] text-xs py-1.5"
                            value={member.role}
                            onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">No members found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Team;
