import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Welcome() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center max-w-2xl w-full animate-fade-in-up">
          {/* Brand Icon */}
          <div className="mb-4 animate-scale-in">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#3B82F6" />
              <text x="50%" y="54%" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" dy=".3em">EMS</text>
            </svg>
          </div>
          {/* Brand Name */}
          <span className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-wide mb-2 animate-fade-in">
            Employee Management System
          </span>
          {/* Heading */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center animate-fade-in-up delay-100">
            Welcome to Employee Management System
          </h1>
          {/* Tagline */}
          <p className="text-lg text-gray-700 mb-4 text-center animate-fade-in-up delay-200">
            Empower your HR team with seamless employee management, analytics, and collaboration tools.
          </p>
          {/* Feature Highlights */}
          <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-fade-in-up delay-300">
            <li className="flex items-center gap-2 text-gray-600"><span className="text-blue-500">✔</span> Secure Employee Records</li>
            <li className="flex items-center gap-2 text-gray-600"><span className="text-blue-500">✔</span> Attendance & Leave Tracking</li>
            <li className="flex items-center gap-2 text-gray-600"><span className="text-blue-500">✔</span> Performance Analytics</li>
            <li className="flex items-center gap-2 text-gray-600"><span className="text-blue-500">✔</span> Modern, Responsive UI</li>
          </ul>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center animate-fade-in-up delay-400">
            <Link to="/get-started" className="w-full md:w-auto">
              <button className="px-7 py-3 w-full bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                Get Started
              </button>
            </Link>
            <Link to="/login" className="w-full md:w-auto">
              <button className="px-7 py-3 w-full bg-white text-blue-600 font-semibold rounded-xl shadow-lg border border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                Login
              </button>
            </Link>
            <Link to="/register" className="w-full md:w-auto">
              <button className="px-7 py-3 w-full bg-white text-purple-600 font-semibold rounded-xl shadow-lg border border-purple-300 hover:bg-purple-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="text-center py-6 text-white text-sm opacity-80 animate-fade-in-up delay-500">
        &copy; {new Date().getFullYear()} Employee Management System. All rights reserved.
      </footer>
      {/* Custom Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease;
        }
        .animate-fade-in-up.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in-up.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in-up.delay-300 {
          animation-delay: 0.3s;
        }
        .animate-fade-in-up.delay-400 {
          animation-delay: 0.4s;
        }
        .animate-fade-in-up.delay-500 {
          animation-delay: 0.5s;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Welcome;
