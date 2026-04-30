import { useState, useEffect } from 'react';

const API = '/_/backend/api';

function LabManager() {
  const [labs, setLabs] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', capacity: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchLabs(); }, []);

  async function fetchLabs() {
    const data = await fetch(`${API}/labs`).then(r => r.json());
    setLabs(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/labs/${editing}` : `${API}/labs`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) })
    });
    setForm({ name: '', location: '', capacity: '' });
    setEditing(null);
    fetchLabs();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this lab?')) return;
    await fetch(`${API}/labs/${id}`, { method: 'DELETE' });
    fetchLabs();
  }

  function startEdit(lab) {
    setForm({ name: lab.name, location: lab.location, capacity: lab.capacity });
    setEditing(lab._id);
  }

  return (
    <div>
      <h2>Manage Labs</h2>

      <div className="form-card">
        <h3>{editing ? 'Edit Lab' : 'Add Lab'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Lab Name *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. AI Research Lab"
              required
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. LWSN 3102"
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              placeholder="Number of workstations"
              min="0"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editing ? 'Update Lab' : 'Add Lab'}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', location: '', capacity: '' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Lab Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.length === 0 && (
              <tr><td colSpan="4" className="empty-row">No labs yet. Add one above.</td></tr>
            )}
            {labs.map(lab => (
              <tr key={lab._id}>
                <td>{lab.name}</td>
                <td>{lab.location}</td>
                <td>{lab.capacity}</td>
                <td>
                  <button className="btn-edit" onClick={() => startEdit(lab)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(lab._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LabManager;
