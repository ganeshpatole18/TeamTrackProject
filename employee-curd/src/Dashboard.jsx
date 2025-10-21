// Dashboard with fetchable list + inline update/delete actions
import React from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080';
const GET_ALL = `${API_BASE}/getAll`;
// Adjust these to match your backend routes
// Update: try query-string format first, then path formats
const UPDATE_USER_QS = (id) => `${API_BASE}/update?id=${encodeURIComponent(id)}`;
const UPDATE_USER_PATH = (id) => `${API_BASE}/update/${id}`;
const REGISTER_USER = `${API_BASE}/register`;
// Delete is a DELETE request to /delete?id=<id>
const DELETE_USER = (id) => `${API_BASE}/delete?id=${encodeURIComponent(id)}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);
  const [editDraft, setEditDraft] = React.useState({ name: '', email: '' });
  const [searchEmail, setSearchEmail] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState(null);
  const [createForm, setCreateForm] = React.useState({ name: '', email: '', password: '' });
  const [creating, setCreating] = React.useState(false);

  const getIdRaw = (u) => (u && (u.id ?? u._id ?? u.userId)) || null;
  const getId = (u) => {
    const raw = getIdRaw(u);
    return raw === null || raw === undefined ? null : String(raw);
  };

  const fetchAllUsers = async () => {
    try {
      setError('');
      // Reset transient UI states on refresh
      setEditingId(null);
      setSearchResult(null);
      setLoading(true);
      const res = await fetch(GET_ALL);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.users || data.employees || []);
      setUsers(list);
    } catch (e) {
      setError(e.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const beginEdit = (u) => {
    const id = getId(u);
    setEditingId(id);
    setEditDraft({ name: u.name || u.fullName || '', email: u.email || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ name: '', email: '' });
  };

  const saveEdit = async (idRaw) => {
    const id = idRaw == null ? null : String(idRaw);
    try {
      setError('');
      setLoading(true);
      if (!id) throw new Error('Update failed: missing id');
      const tryUrls = [
        UPDATE_USER_QS(id),
        UPDATE_USER_PATH(id),
        `${API_BASE}/employees/${id}`,
        `${API_BASE}/user/${id}`,
      ];
      let ok = false; let lastStatus = 0; let lastBody = '';
      for (const url of tryUrls) {
        const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
        });
        lastStatus = res.status;
        if (res.ok) { ok = true; break; }
  try { lastBody = await res.text(); } catch { /* ignore body parse error */ }
      }
      if (!ok) throw new Error(`Update failed (${lastStatus}): ${lastBody || 'no body'}`);
      // Optimistically update the row locally
      setUsers((prev) => prev.map((u) => (getId(u) === id ? { ...u, ...editDraft } : u)));
      cancelEdit();
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (idRaw) => {
    const id = idRaw == null ? null : String(idRaw);
    if (!id) {
      setError('Cannot delete: missing user id');
      return;
    }
    if (!window.confirm('Delete this user?')) return;
    try {
      setError('');
      setLoading(true);
      const tryUrls = [
        DELETE_USER(id),
        `${API_BASE}/employees/${id}`,
        `${API_BASE}/user/${id}`,
        `${API_BASE}/deleteEmployee/${id}`,
      ];
      let ok = false; let lastStatus = 0; let lastBody = '';
      for (const url of tryUrls) {
        const res = await fetch(url, { method: 'DELETE' });
        lastStatus = res.status;
        if (res.ok) { ok = true; break; }
  try { lastBody = await res.text(); } catch { /* ignore body parse error */ }
      }
      if (!ok) throw new Error(`Delete failed (${lastStatus}): ${lastBody || 'no body'}`);
      setUsers((prev) => prev.filter((u) => getId(u) !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    const payload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
    };
    if (!payload.name || !payload.email || !payload.password) {
      setError('Please fill name, email, and password');
      return;
    }
    try {
      setError('');
      setCreating(true);
      const res = await fetch(REGISTER_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Create failed (${res.status}): ${text || 'no body'}`);
      }
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      const created = data?.user ?? data?.employee ?? data;
      if (created && (created.email || created.name || created.fullName)) {
        setUsers((prev) => [created, ...prev]);
      } else {
        await fetchAllUsers();
      }
      setCreateForm({ name: '', email: '', password: '' });
    } catch (e) {
      setError(e.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const findByEmail = async () => {
    const email = searchEmail.trim();
    if (!email) {
      // If empty input, reload all and clear result
      setSearchResult(null);
      await fetchAllUsers();
      return;
    }
    try {
      setError('');
      setSearching(true);
      const url = `${API_BASE}/findByEmail?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) {
        // Treat 404 as no user found; others as errors
        let body = '';
        try { body = await res.text(); } catch { /* ignore */ }
        if (res.status === 404) {
          setSearchResult({ notFound: true });
        } else {
          throw new Error(`Search failed (${res.status}): ${body || 'no body'}`);
        }
      } else {
        const data = await res.json();
        const user = data?.user ?? data?.employee ?? data;
        if (user && (user.email || user.name || user.fullName)) {
          setSearchResult(user);
        } else {
          setSearchResult({ notFound: true });
        }
      }
    } catch (e) {
      setError(e.message || 'Search failed');
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-slate-100 flex flex-col p-6 gap-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">Employee Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={fetchAllUsers} disabled={loading} className={`px-4 py-2 rounded-lg transition text-sm ${loading ? 'bg-slate-600 opacity-70 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}>All Users</button>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Add Employee</h2>
          <input
            value={createForm.name}
            onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Name"
            className="px-3 py-2 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <input
            value={createForm.email}
            onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            className="px-3 py-2 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <input
            type="password"
            value={createForm.password}
            onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Password"
            className="px-3 py-2 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            onClick={createUser}
            disabled={creating}
            className={`py-2 rounded transition text-sm font-medium flex items-center justify-center ${creating ? 'bg-purple-700 opacity-70 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'}`}
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>

        <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 shadow-lg flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Find by Email</h2>
          <div className="flex gap-2">
            <input
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); findByEmail(); } }}
              placeholder="user@example.com"
              className="flex-1 px-3 py-2 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
            <button
              onClick={findByEmail}
              disabled={searching}
              className={`px-4 py-2 rounded transition text-sm flex items-center justify-center min-w-[90px] ${searching ? 'bg-pink-700 opacity-70 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500'}`}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
          <p className="text-xs text-slate-400">Leave empty & press Search to reload all.</p>
          {searchResult && !searchResult.notFound && (
            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm">
              <div className="font-medium text-slate-200">Result</div>
              <div className="mt-1 text-slate-300">Name: {searchResult.name || searchResult.fullName || '—'}</div>
              <div className="text-slate-300">Email: {searchResult.email || '—'}</div>
            </div>
          )}
          {searchResult?.notFound && (
            <div className="mt-3 text-xs text-slate-400">No user found for that email.</div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur rounded-xl shadow-lg p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Employees</h2>
          {loading ? (
            <span className="text-xs animate-pulse text-slate-300">Loading...</span>
          ) : users.length > 0 ? (
            <span className="text-xs text-slate-300">{users.length} users</span>
          ) : null}
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-300 border-b border-slate-700">
              <th className="py-2 pr-3 font-medium">Name</th>
              <th className="py-2 pr-3 font-medium">Email</th>
              <th className="py-2 pr-3 font-medium w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="3" className="py-6 text-center text-slate-400">Click “All Users” to load users</td>
              </tr>
            )}
            {users.map((u, idx) => {
              const backendId = getId(u);
              const rowKey = backendId ?? idx; // key only; do NOT use idx for API calls
              const isEditing = editingId === backendId;
              return (
                <tr key={rowKey} className="border-b border-slate-700/60 last:border-none">
                  <td className="py-2 pr-3 align-middle">
                    {isEditing ? (
                      <input
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                        className="px-2 py-1 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs w-full"
                      />
                    ) : (
                      <span>{u.name || u.fullName || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 align-middle">
                    {isEditing ? (
                      <input
                        value={editDraft.email}
                        onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))}
                        className="px-2 py-1 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs w-full"
                      />
                    ) : (
                      <span>{u.email || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 align-middle">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(backendId)} disabled={!backendId} className={`px-2 py-1 text-xs rounded ${backendId ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-600 cursor-not-allowed opacity-60'}`}>Save</button>
                        <button onClick={cancelEdit} className="px-2 py-1 text-xs rounded bg-slate-600 hover:bg-slate-500">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => beginEdit(u)} className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500">Edit</button>
                        <button onClick={() => removeUser(backendId)} disabled={!backendId} title={!backendId ? 'Missing id' : undefined} className={`px-2 py-1 text-xs rounded ${backendId ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-600 cursor-not-allowed opacity-60'}`}>Delete</button>
                        <button
                          onClick={() => navigate(`/profile/${encodeURIComponent(u.email || '')}`)}
                          disabled={!u.email}
                          title={!u.email ? 'Missing email' : undefined}
                          className={`px-2 py-1 text-xs rounded ${u.email ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-600 cursor-not-allowed opacity-60'}`}
                        >
                          Show
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="mt-auto text-center text-xs text-slate-500 pt-4 pb-2">
        &copy; 2025 EMS Dashboard
      </footer>
    </div>
  );
}
