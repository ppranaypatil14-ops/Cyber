import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-slate-800">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="text-xl font-bold text-[#0052CC] tracking-tight">
          Cyber<span className="font-semibold text-slate-800">Login</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-6 text-slate-600">
            <a href="#" className="text-[#0052CC] border-b-2 border-[#0052CC] pb-1">Sign In</a>
            <a href="#" className="hover:text-slate-900 pb-1">Register</a>
          </div>
          <button className="text-slate-500 hover:text-slate-800 ml-4">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-sm">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500 text-sm">Access your professional dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Email or Username</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-[#0052CC] hover:underline">Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 tracking-widest focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0052CC] hover:bg-[#0047b3] text-white font-medium py-2.5 rounded-md transition-colors mt-2"
            >
              Login
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-400">or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account? <a href="#" className="font-semibold text-[#0052CC] hover:underline">Create an account</a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#F9FAFB] border-t border-slate-200 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-700">CyberLogin Systems</p>
          <p className="text-slate-400 mt-1">© 2026 CyberLogin Systems. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-700">Privacy Policy</a>
          <a href="#" className="hover:text-slate-700">Terms of Service</a>
          <a href="#" className="hover:text-slate-700">Help Center</a>
        </div>
      </footer>

    </div>
  );
}
