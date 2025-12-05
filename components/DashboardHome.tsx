import React from 'react';
import { SavedDocument } from '../types';
import { Button } from './Button';

interface DashboardHomeProps {
  documents: SavedDocument[];
  onCreateNew: () => void;
  onViewDocument: (id: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ documents, onCreateNew, onViewDocument }) => {
  const recentDocs = documents.slice(0, 3);
  const totalCharts = documents.reduce((acc, doc) => acc + doc.chartCount, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-500">Here is what's happening in your workspace.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Documents</p>
            <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Charts Generated</p>
            <p className="text-2xl font-bold text-slate-900">{totalCharts}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center items-start">
           <h3 className="font-bold text-lg mb-2">Create New Report</h3>
           <p className="text-indigo-100 text-sm mb-4">Transform raw text into visual insights instantly.</p>
           <button 
             onClick={onCreateNew}
             className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors"
           >
             Start Analysis &rarr;
           </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Recent Documents</h2>
        {documents.length > 0 && (
            <button className="text-indigo-600 text-sm font-medium hover:underline" onClick={() => onCreateNew()}>View All</button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900">No documents yet</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">Get started by analyzing your first article or report.</p>
          <Button onClick={onCreateNew}>Create First Report</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentDocs.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => onViewDocument(doc.id)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {doc.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">
                {doc.excerpt}
              </p>
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                  {doc.chartCount} Charts Included
                </span>
                <span className="group-hover:translate-x-1 transition-transform">
                   View &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};