import React from 'react';
import { motion } from 'framer-motion';

export const LoadingOverlay: React.FC = () => {
  const messages = [
    "Reading article...",
    "Extracting data points...",
    "Calculating trends...",
    "Designing charts...",
    "Finalizing layout..."
  ];
  
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          className="absolute inset-0 border-4 border-indigo-100 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
            className="absolute inset-0 flex items-center justify-center text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            ✨
        </motion.div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Gemini is thinking</h2>
      <div className="h-6 overflow-hidden">
          <motion.p 
            key={msgIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-indigo-600 font-medium"
          >
            {messages[msgIndex]}
          </motion.p>
      </div>
    </div>
  );
};
