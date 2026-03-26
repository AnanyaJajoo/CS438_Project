import { useState, useEffect } from 'react';

const API = '/api';

function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '', year: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchStudents(); }, []);

  async function fetchStudents() {
    try {
      const data = await fetch(`${API}/students`).then(r => r.json());
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load students: ' + err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/students/${editing}` : `${API}/students`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: form.year ? Number(form.year) : undefined })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save student'); return; }
      setForm({ name: '', email: '', department: '', year: '' });
      setEditing(null);
      fetchStudents();
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student?')) return;
    await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  }

  function startEdit(s) {
    setForm({ name: s.name, email: s.email, department: s.department || '', year: s.year || '' });
    setEditing(s._id);
  }

  return (
    <div>
      <h2>Manage Students</h2>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>{error}</div>}

      <div className="form-card">
        <h3>{editing ? 'Edit Student' : 'Add Student'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Jane Smith"
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. smith123@purdue.edu"
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })}
              placeholder="e.g. 2"
              min="1"
              max="6"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editing ? 'Update Student' : 'Add Student'}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', email: '', department: '', year: '' }); }}>
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
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan="5" className="empty-row">No students yet. Add one above.</td></tr>
            )}
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department || '—'}</td>
                <td>{s.year || '—'}</td>
                <td>
                  <button className="btn-edit" onClick={() => startEdit(s)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentManager;
