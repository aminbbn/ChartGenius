import React, { useState } from 'react';
import { Button } from './Button';
import { AuthService } from '../services/authService';
import { User } from '../types';
import { motion } from 'framer-motion';

interface AuthScreenProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        let user: User;
        if (isLogin) {
            user = await AuthService.login(email, password);
        } else {
            if (!name.trim()) throw new Error("Name is required");
            user = await AuthService.signup(name, email, password);
        }
        onSuccess(user);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword('');
    // Optional: clear other fields or keep them
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 overflow-hidden flex flex-col md:flex-row min-h-[650px] z-10"
      >
        
        {/* Left Side: Brand & Visuals */}
        <div className="md:w-5/12 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 z-20 p-2 pr-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10 flex items-center gap-2 group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back</span>
            </button>

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 mt-12 md:mt-0">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                        <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5 14C5 12.8954 5.89543 12 7 12H9C10.1046 12 11 12.8954 11 14V21H7C5.89543 21 5 20.1046 5 19V14Z" fillOpacity="0.7" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M13 7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V21H15C13.8954 21 13 20.1046 13 19V7Z" />
                            <path d="M21 2L21.6 3.8L23.4 4.4L21.6 5L21 6.8L20.4 5L18.6 4.4L20.4 3.8L21 2Z" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-indigo-100">ChartGenius</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Turn text into <span className="text-indigo-200">visual insights</span>.
                </h1>
                <p className="text-indigo-100 text-lg leading-relaxed opacity-90 max-w-sm">
                    Automated data extraction and chart generation powered by Gemini AI. Perfect for analysts, writers, and students.
                </p>
            </div>

            <div className="relative z-10 mt-12">
                <div className="flex items-center gap-4 bg-indigo-700/50 p-4 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
                    <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                {i === 4 ? '+' : ''}
                             </div>
                         ))}
                    </div>
                    <div className="text-xs font-medium">
                        <p className="text-white font-bold">4.9/5 Rating</p>
                        <p className="text-indigo-200">from 2,000+ users</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="text-slate-500">
                        {isLogin ? 'Enter your credentials to access your workspace.' : 'Create your free account in seconds.'}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder-slate-400"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder-slate-400"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            {isLogin && <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Forgot Password?</a>}
                         </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full py-4 text-base shadow-xl shadow-indigo-100">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={toggleMode}
                            className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};