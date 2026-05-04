import React, { useEffect, useState } from 'react';
import Layout from '../components/dashboard/Layout';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import api from '../utils/api';
import { PlusIcon, SearchIcon, FolderIcon } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchProjects = () => {
    api.get('/projects').then(({ data }) => setProjects(data.projects)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-500 text-sm mt-1">{projects.length} projects total</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <PlusIcon size={16} /> New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className="input pl-9" placeholder="Search projects..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'on-hold', 'completed', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-brand-600 text-white' : 'bg-surface-100 text-gray-400 hover:text-gray-200 border border-surface-200'}`}>
                {s === 'all' ? 'All' : s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-surface-100" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <FolderIcon size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-gray-400 font-medium mb-2">No projects found</h3>
            <p className="text-gray-600 text-sm mb-6">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <PlusIcon size={16} /> Create Project
              </button>
            )}
          </div>
        )}

        {showForm && (
          <ProjectForm
            onClose={() => setShowForm(false)}
            onSave={() => fetchProjects()}
          />
        )}
      </div>
    </Layout>
  );
};

export default Projects;
