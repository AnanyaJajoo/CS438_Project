import { useState, useEffect } from 'react';

const API = '/api';

function GrantReport() {
  const [projects, setProjects] = useState([]);
  const [labs, setLabs] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', labId: '', minBudget: '', maxBudget: '' });

  useEffect(() => {
    fetch(`${API}/labs`).then(r => r.json()).then(data => setLabs(Array.isArray(data) ? data : []));
    fetchProjects({});
  }, []);

  async function fetchProjects(f) {
    const params = new URLSearchParams();
    if (f.startDate) params.set('startDate', f.startDate);
    if (f.endDate) params.set('endDate', f.endDate);
    if (f.labId) params.set('labId', f.labId);
    if (f.minBudget) params.set('minBudget', f.minBudget);
    if (f.maxBudget) params.set('maxBudget', f.maxBudget);
    const data = await fetch(`${API}/projects${params.toString() ? '?' + params : ''}`).then(r => r.json());
    setProjects(Array.isArray(data) ? data : []);
  }

  function handleApply(e) {
    e.preventDefault();
    fetchProjects(filters);
  }

  function handleClear() {
    const cleared = { startDate: '', endDate: '', labId: '', minBudget: '', maxBudget: '' };
    setFilters(cleared);
    fetchProjects(cleared);
  }

  // Statistics calculated from filtered results
  const total = projects.length;
  const avgBudget = total > 0
    ? (projects.reduce((s, p) => s + (p.budget || 0), 0) / total).toFixed(2)
    : '0.00';
  const avgResearchers = total > 0
    ? (projects.reduce((s, p) => s + p.researchers.length, 0) / total).toFixed(1)
    : '0.0';
  const completed = projects.filter(p => p.status === 'completed').length;
  const pctCompleted = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <h2>Grant Report</h2>

      {/* Filter form — lab dropdown is built dynamically from DB */}
      <div className="form-card">
        <h3>Filter Projects</h3>
        <form onSubmit={handleApply} className="form-grid">
          <div className="form-group">
            <label>Start Date (from)</label>
            <input type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Start Date (to)</label>
            <input type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Lab</label>
            <select value={filters.labId} onChange={e => setFilters({ ...filters, labId: e.target.value })}>
              <option value="">— All Labs —</option>
              {labs.map(l => <option key={l._id} value={l._id}>{l.name} ({l.location})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Min Budget ($)</label>
            <input type="number" value={filters.minBudget} onChange={e => setFilters({ ...filters, minBudget: e.target.value })} placeholder="0" min="0" />
          </div>
          <div className="form-group">
            <label>Max Budget ($)</label>
            <input type="number" value={filters.maxBudget} onChange={e => setFilters({ ...filters, maxBudget: e.target.value })} placeholder="No limit" min="0" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Apply</button>
            <button type="button" className="btn-secondary" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>

      {/* Statistics for filtered results */}
      <div className="form-card">
        <h3>Statistics ({total} project{total !== 1 ? 's' : ''} found)</h3>
        <table>
          <tbody>
            <tr>
              <td><strong>Average Budget</strong></td>
              <td>${Number(avgBudget).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Average Researchers per Project</strong></td>
              <td>{avgResearchers}</td>
            </tr>
            <tr>
              <td><strong>Completed Projects</strong></td>
              <td>{completed} / {total} ({pctCompleted}%)</td>
            </tr>
            <tr>
              <td><strong>Ongoing Projects</strong></td>
              <td>{total - completed}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Matching projects table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Lab</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Researchers</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan="6" className="empty-row">No projects match the filters.</td></tr>
            )}
            {projects.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.lab ? p.lab.name : '—'}</td>
                <td>${(p.budget || 0).toLocaleString()}</td>
                <td>{p.status}</td>
                <td>{p.researchers.map(r => r.name).join(', ') || '—'}</td>
                <td>{p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GrantReport;
