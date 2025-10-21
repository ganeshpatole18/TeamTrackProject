import React from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import axios from 'axios'
function Register() {
  const [user, setUser] = React.useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const fakeProgress = () => {
    setProgress(10);
    const steps = [30, 55, 70, 85, 92, 97, 100];
    steps.forEach((val, idx) => {
      setTimeout(() => setProgress(val), 120 + idx * 120);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      setProgress(0);
      fakeProgress();
      const { data } = await axios.post('http://localhost:8080/register', user, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            setProgress(p => (percent > p ? percent : p));
          }
        }
      });
      const displayName = data.user?.name || data.name || '';
      alert(`${data.message || 'Success'}${displayName ? ' | Welcome ' + displayName : ''}`);
      setUser({ name: '', email: '', password: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  return (
    <>
      {/* Top Loading Bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-150"
            style={{ width: progress + '%' }}
          />
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
        <div className="relative bg-white bg-opacity-95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-sm font-medium text-purple-700 tracking-wide">Processing...</p>
            </div>
          )}
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            Register
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                name='name' onChange={handleChange} value={user.name} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                name='email' onChange={handleChange} value={user.email} />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
                name='password' onChange={handleChange} value={user.password} />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full relative bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 overflow-hidden
                ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-purple-700 hover:scale-105'}`}
            >
              <span className={loading ? 'invisible' : 'visible'}>Register</span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between mt-6 text-sm text-gray-600">
            <Link to="/login" className="hover:underline text-blue-600">
              Already have an account? Login
            </Link>
            <Link to="/" className="hover:underline text-pink-600">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
          .animate-fade-in-up { animation: fadeInUp 0.9s ease; }
          @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        `}</style>
      </div>
    </>
  )
}

export default Register
