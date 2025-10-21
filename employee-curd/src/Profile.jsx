import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080';

export default function Profile() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const run = async () => {
      if (!email) { setError('Missing email'); setLoading(false); return; }
      try {
        setError('');
        setLoading(true);
        const url = `${API_BASE}/findByEmail?email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const text = await res.text();
        if (!res.ok) throw new Error(`Failed (${res.status}): ${text || 'no body'}`);
        let data; try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
        const u = data?.user ?? data?.employee ?? data;
        setUser(u || null);
      } catch (e) {
        setError(e.message || 'Failed to load profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">Profile</h1>
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm">Back</button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 rounded-md text-sm">{error}</div>
        )}

        <div className="bg-slate-800/60 backdrop-blur rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-24 w-24 rounded-full bg-slate-700 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ) : user ? (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                  {(user.name || user.fullName || 'U').slice(0,1).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold">{user.name || user.fullName || 'Unnamed'}</div>
                <div className="text-slate-300 text-sm mt-1">{user.email || '—'}</div>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900/40 rounded-lg p-4">
                    <div className="text-xs uppercase text-slate-400">Employee ID</div>
                    <div className="text-slate-200 mt-1">{user.id || user._id || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-4">
                    <div className="text-xs uppercase text-slate-400">Status</div>
                    <div className="text-slate-200 mt-1">Active</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-300">No user found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
