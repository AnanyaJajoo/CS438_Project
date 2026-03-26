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

  return (
    <div>
      <h2>Grant Report</h2>

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

      <p style={{ marginBottom: 10, fontSize: 13 }}>{projects.length} project(s) found</p>

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
