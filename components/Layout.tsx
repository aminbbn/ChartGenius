import React, { useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: any) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If Guest, limit navigation items
  const isGuest = !currentUser;

  const navItems = isGuest ? [
    { id: 'create', label: 'New Analysis', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )}
  ] : [
    { id: 'dashboard', label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'create', label: 'New Analysis', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )},
    { id: 'documents', label: 'My Documents', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
  ];

  // Professional Logo Component
  const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 14C5 12.8954 5.89543 12 7 12H9C10.1046 12 11 12.8954 11 14V21H7C5.89543 21 5 20.1046 5 19V14Z" fillOpacity="0.7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M13 7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V21H15C13.8954 21 13 20.1046 13 19V7Z" />
      <path d="M21 2L21.6 3.8L23.4 4.4L21.6 5L21 6.8L20.4 5L18.6 4.4L20.4 3.8L21 2Z" />
    </svg>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="flex items-center justify-center h-16 border-b border-slate-100 px-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeView(isGuest ? 'landing' : 'dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LogoIcon className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">ChartGenius</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-4">
            Workspace
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === item.id || (currentView.startsWith('doc') && item.id === 'documents')
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          
          {isGuest && (
             <div className="mt-8 mx-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-800 font-medium mb-2">Using Guest Mode</p>
                <p className="text-xs text-indigo-600 mb-3">Sign up to save your reports permanently.</p>
                <button 
                    onClick={onLogout} // Re-using logout to go back to landing/auth
                    className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
                >
                    Create Account
                </button>
             </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${isGuest ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
              {isGuest ? 'G' : currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{isGuest ? 'Guest User' : currentUser?.name}</p>
              <p className="text-xs text-slate-500 truncate">{isGuest ? 'Not signed in' : currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 h-16 shrink-0 z-30">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <LogoIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">ChartGenius</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="flex justify-end mb-4">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
               </div>
               
               <div className="mb-6 px-4 pb-4 border-b border-slate-100">
                    <p className="font-medium text-slate-900 truncate">{isGuest ? 'Guest User' : currentUser?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{isGuest ? 'Not signed in' : currentUser?.email}</p>
               </div>

               <nav className="space-y-2 flex-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${
                        currentView === item.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
               </nav>

               <button 
                    onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 bg-red-50 py-3 rounded-lg mt-4"
                >
                    {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
               </button>
            </div>
          </div>
        )}

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
};