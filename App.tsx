import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardHome } from './components/DashboardHome';
import { InputView } from './components/InputView';
import { ArticleView } from './components/ArticleView';
import { DocumentList } from './components/DocumentList';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AuthScreen } from './components/AuthScreen';
import { LandingPage } from './components/LandingPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { analyzeArticle } from './services/geminiService';
import { saveDocument, getDocuments, getDocument, deleteDocument } from './services/storageService';
import { AuthService } from './services/authService';
import { SavedDocument, User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 'landing' is the default view now
  const [currentView, setCurrentView] = useState('landing');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [activeDocument, setActiveDocument] = useState<SavedDocument | undefined>(undefined);
  
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize DB and Session
  useEffect(() => {
    const initSession = async () => {
        try {
            const user = await AuthService.getCurrentUser();
            if (user) {
                setCurrentUser(user);
                setCurrentView('dashboard'); // Skip landing if logged in
            }
        } catch (e) {
            console.error("Failed to restore session", e);
        } finally {
            setIsLoadingUser(false);
        }
    };
    initSession();
  }, []);

  // Load documents when user changes (only if real user)
  useEffect(() => {
    if (currentUser) {
        refreshDocuments();
    } else {
        setDocuments([]);
    }
  }, [currentUser]);

  // Load active document when view changes to doc-viewer
  useEffect(() => {
    if (currentView === 'doc-viewer' && activeDocId) {
        const loadDoc = async () => {
            const doc = await getDocument(activeDocId);
            setActiveDocument(doc);
        };
        loadDoc();
    }
  }, [currentView, activeDocId]);

  const refreshDocuments = async () => {
    try {
        const docs = await getDocuments();
        setDocuments(docs);
    } catch (e) {
        console.error("Failed to load documents", e);
    }
  };

  const navigateTo = (view: string, docId?: string) => {
    setCurrentView(view);
    if (docId) setActiveDocId(docId);
    setError(null);
  };

  const handleLoginSuccess = async (user: User) => {
      setCurrentUser(user);
      setCurrentView('dashboard');
  };

  const handleLogout = () => {
      AuthService.logout();
      setCurrentUser(null);
      setCurrentView('landing'); // Return to landing on logout
  };

  const handleStartGuestMode = () => {
      // Allow user to enter app without auth
      setCurrentView('create');
  };

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const blocks = await analyzeArticle(text);
      
      // If user is guest, we can't save to DB easily without user ID.
      // For MVP, we can create a temporary doc in memory or force auth for saving.
      // Or, we create a temporary "guest" user ID.
      
      if (!currentUser) {
          // Create a temp object for display only (won't persist on reload unless we handle guest storage)
          const tempDoc: SavedDocument = {
             id: 'temp-' + Date.now(),
             userId: 'guest',
             title: 'Analysis Result',
             excerpt: text.substring(0, 100),
             createdAt: Date.now(),
             blocks: blocks,
             originalText: text,
             chartCount: blocks.filter(b => b.type === 'chart').length,
             direction: 'ltr' // Simple default for guest
          };
          setActiveDocument(tempDoc);
          setActiveDocId(tempDoc.id);
          // Don't actually save to DB to avoid auth errors in storageService
          setCurrentView('doc-viewer');
      } else {
          // Normal Flow
          const newDoc = await saveDocument(text, blocks);
          await refreshDocuments();
          navigateTo('doc-viewer', newDoc.id);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
        await deleteDocument(id);
        await refreshDocuments();
        if (currentView === 'doc-viewer' && activeDocId === id) {
            navigateTo('documents');
        }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
          return (
            <LandingPage 
                onStart={handleStartGuestMode} 
                onLogin={() => setCurrentView('auth')} 
                onViewPage={(page) => setCurrentView(page)}
            />
          );

      case 'privacy':
          return <PrivacyPolicy onBack={() => setCurrentView(currentUser ? 'dashboard' : 'landing')} />;

      case 'terms':
          return <TermsOfService onBack={() => setCurrentView(currentUser ? 'dashboard' : 'landing')} />;

      case 'auth':
          return (
            <AuthScreen 
                onSuccess={handleLoginSuccess} 
                onBack={() => setCurrentView('landing')}
            />
          );

      case 'dashboard':
        return (
          <DashboardHome 
            documents={documents} 
            onCreateNew={() => navigateTo('create')} 
            onViewDocument={(id) => navigateTo('doc-viewer', id)}
          />
        );
      
      case 'create':
        return (
          <InputView 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
          />
        );
      
      case 'documents':
        return (
          <DocumentList 
            documents={documents} 
            onViewDocument={(id) => navigateTo('doc-viewer', id)}
            onDeleteDocument={handleDelete}
          />
        );

      case 'doc-viewer':
        // Handle guest mode doc viewing vs saved doc viewing
        if (!activeDocId) return <div>Document ID missing</div>;
        if (!activeDocument) return <div className="p-10 text-center text-slate-500">Loading Document...</div>;
        
        return (
          <ArticleView 
            blocks={activeDocument.blocks} 
            originalText={activeDocument.originalText}
            title={activeDocument.title}
            onBack={() => navigateTo(currentUser ? 'documents' : 'create')} 
            onRegenerate={handleAnalyze}
          />
        );

      default:
        return <div>View not found</div>;
    }
  };

  if (isLoadingUser) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div></div>;
  }

  // Views that don't need the Layout wrapper
  if (['landing', 'auth', 'privacy', 'terms'].includes(currentView)) {
      return (
        <>
            {renderContent()}
            {isAnalyzing && <LoadingOverlay />}
        </>
      );
  }

  return (
    <>
      <Layout 
        currentView={currentView} 
        onChangeView={(view) => navigateTo(view)}
        currentUser={currentUser}
        onLogout={handleLogout}
      >
         {error && (
            <div className="m-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        {renderContent()}
      </Layout>
      
      {isAnalyzing && <LoadingOverlay />}
    </>
  );
}

export default App;