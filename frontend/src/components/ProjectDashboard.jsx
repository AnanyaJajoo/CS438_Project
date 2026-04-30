import { useState, useEffect } from 'react';

const API = '/_/backend/api';

const emptyForm = () => ({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: '',
  status: 'ongoing',
  lab: '',
  researchers: []
});

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [labs, setLabs] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [p, l, s] = await Promise.all([
      fetch(`${API}/projects`).then(r => r.json()),
      fetch(`${API}/labs`).then(r => r.json()),
      fetch(`${API}/students`).then(r => r.json()),
    ]);
    setProjects(Array.isArray(p) ? p : []);
    setLabs(Array.isArray(l) ? l : []);
    setStudents(Array.isArray(s) ? s : []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/projects/${editing}` : `${API}/projects`;
    const payload = {
      ...form,
      budget: Number(form.budget) || 0,
      lab: form.lab || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null
    };
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setForm(emptyForm());
    setEditing(null);
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  function startEdit(project) {
    setForm({
      title: project.title,
      description: project.description || '',
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
      budget: project.budget,
      status: project.status,
      lab: project.lab?._id || '',
      researchers: project.researchers.map(r => r._id)
    });
    setEditing(project._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleResearcher(id) {
    setForm(f => ({
      ...f,
      researchers: f.researchers.includes(id)
        ? f.researchers.filter(r => r !== id)
        : [...f.researchers, id]
    }));
  }

  function cancelForm() {
    setForm(emptyForm());
    setEditing(null);
    setShowForm(false);
  }

  return (
    <div>
      <div className="section-header">
        <h2>Research Projects</h2>
        <button className="btn-primary" onClick={() => { cancelForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editing ? 'Edit Project' : 'New Project'}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group span-2">
              <label>Project Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Deep Learning for Protein Folding"
                required
              />
            </div>

            <div className="form-group span-2">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the research project..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Budget ($)</label>
              <input
                type="number"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group span-2">
              <label>Lab Location</label>
              {labs.length === 0
                ? <p className="hint">No labs found. Add labs in the Labs tab first.</p>
                : (
                  <select value={form.lab} onChange={e => setForm({ ...form, lab: e.target.value })}>
                    <option value="">— Select a Lab —</option>
                    {labs.map(l => (
                      <option key={l._id} value={l._id}>{l.name} ({l.location})</option>
                    ))}
                  </select>
                )}
            </div>

            <div className="form-group span-2">
              <label>Lead Researchers</label>
              {students.length === 0
                ? <p className="hint">No students found. Add students in the Students tab first.</p>
                : (
                  <div className="checkbox-grid">
                    {students.map(s => (
                      <label key={s._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={form.researchers.includes(s._id)}
                          onChange={() => toggleResearcher(s._id)}
                        />
                        <span>{s.name} <em>({s.department || 'No dept'})</em></span>
                      </label>
                    ))}
                  </div>
                )}
            </div>

            <div className="form-actions span-2">
              <button type="submit" className="btn-primary">
                {editing ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Lab</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Researchers</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan="7" className="empty-row">No projects yet. Create one above.</td></tr>
            )}
            {projects.map(p => (
              <tr key={p._id}>
                <td>
                  <strong>{p.title}</strong>
                  {p.description && <div className="sub-text">{p.description.slice(0, 60)}{p.description.length > 60 ? '...' : ''}</div>}
                </td>
                <td>{p.lab ? `${p.lab.name}` : '—'}</td>
                <td>${(p.budget || 0).toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${p.status}`}>{p.status}</span>
                </td>
                <td>
                  {p.researchers.length === 0
                    ? <span className="sub-text">None</span>
                    : p.researchers.map(r => (
                      <div key={r._id} className="researcher-chip">{r.name}</div>
                    ))}
                </td>
                <td className="sub-text">
                  {p.startDate && <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>}
                  {p.endDate && <div>End: {new Date(p.endDate).toLocaleDateString()}</div>}
                </td>
                <td>
                  <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectDashboard;
