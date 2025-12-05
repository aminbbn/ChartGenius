import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5 14C5 12.8954 5.89543 12 7 12H9C10.1046 12 11 12.8954 11 14V21H7C5.89543 21 5 20.1046 5 19V14Z" fillOpacity="0.7" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M13 7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V21H15C13.8954 21 13 20.1046 13 19V7Z" />
                 </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">ChartGenius</span>
           </div>
           <button 
             onClick={onBack} 
             className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
           >
             Close
           </button>
        </div>
      </nav>
      
      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-slate-900 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600">
            <p className="lead text-xl text-slate-500 mb-8 border-b border-slate-100 pb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <h3>1. Introduction</h3>
            <p>
              Welcome to ChartGenius ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and use our application.
            </p>

            <h3>2. Information We Collect</h3>
            <p>We collect information that you voluntarily provide to us when you use our services:</p>
            <ul>
                <li><strong>Input Data:</strong> The text, articles, and reports you paste into the application for analysis.</li>
                <li><strong>Account Data:</strong> If you register, we collect your name and email address.</li>
                <li><strong>Generated Content:</strong> The charts and visualizations created through our service.</li>
                <li><strong>Usage Data:</strong> Anonymous analytics about how you interact with our features (e.g., time spent, features used).</li>
            </ul>

            <h3>3. How We Process Your Data</h3>
            <p>
                The core functionality of ChartGenius is powered by Google's Gemini AI. When you request an analysis:
            </p>
            <ul>
                <li>Your input text is transmitted securely to the Google Gemini API for processing.</li>
                <li>We do not use your data to train our own AI models.</li>
                <li>If you are using <strong>Guest Mode</strong>, your data (documents and charts) is stored locally within your browser's IndexedDB. We do not have access to this data on our servers.</li>
                <li>If you are a <strong>Registered User</strong>, your documents are stored securely so you can access them across devices.</li>
            </ul>

            <h3>4. Data Retention</h3>
            <p>
                We practice data minimization. For Guest Mode users, data is retained only on your local device until you clear your browser cache or delete the documents. For registered users, we retain account data until you request deletion.
            </p>

            <h3>5. Third-Party Services</h3>
            <p>We utilize the following third-party providers to deliver our service:</p>
            <ul>
                <li><strong>Google Cloud Platform:</strong> For AI processing (Gemini API).</li>
                <li><strong>Analytics Providers:</strong> To help us understand how our app is used (e.g., anonymous page view counts).</li>
            </ul>

            <h3>6. Data Security</h3>
            <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We use SSL/TLS encryption for all data in transit.
            </p>

            <h3>7. Contact Us</h3>
            <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@chartgenius.app.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};