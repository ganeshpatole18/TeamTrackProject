import React from 'react';
function Foot() {
  return (
   <>
   <footer className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-4 text-center shadow-lg animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-4">
        <div className="mb-2 md:mb-0 font-semibold text-lg">
          &copy; {new Date().getFullYear()} Employee Management System
        </div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:underline hover:text-blue-200 transition">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-blue-200 transition">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-blue-200 transition">Contact</a>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </footer>
   </>
  );
}

export default Foot;
