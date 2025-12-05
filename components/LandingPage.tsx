import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { ContactModal } from './ContactModal';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onViewPage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onViewPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Navbar background opacity based on scroll
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]
  );
  
  const navShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll Handler
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80; // Fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
      </div>

      {/* Navigation */}
      <motion.nav
        style={{ backgroundColor: navBackground, boxShadow: navShadow }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M5 14C5 12.8954 5.89543 12 7 12H9C10.1046 12 11 12.8954 11 14V21H7C5.89543 21 5 20.1046 5 19V14Z" fillOpacity="0.7" />
                <path fillRule="evenodd" clipRule="evenodd" d="M13 7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V21H15C13.8954 21 13 20.1046 13 19V7Z" />
                <path d="M21 2L21.6 3.8L23.4 4.4L21.6 5L21 6.8L20.4 5L18.6 4.4L20.4 3.8L21 2Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ChartGenius</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Use Cases', 'Features', 'How It Works', 'Examples'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => scrollToSection(e, item.toLowerCase().replace(/\s+/g, '-'))}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
             <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Transform Articles into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Visual Insights</span> Instantly
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg"
            >
              AI-powered chart generation that brings your content to life. Paste your text, get professional charts in seconds.
            </motion.p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { text: "100% Free Forever", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                { text: "Smart AI Analysis", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { text: "Unlimited Charts", color: "bg-purple-100 text-purple-700 border-purple-200" }
              ].map((badge, i) => (
                <motion.span
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  transition={{ 
                    delay: 0.4 + (i * 0.1), 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color} cursor-default`}
                >
                  {badge.text}
                </motion.span>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={onStart}
                className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Start Creating Charts
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a 
                href="#examples"
                onClick={(e) => scrollToSection(e, 'examples')}
                className="px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                See Examples
              </a>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1 }}
                className="mt-8 flex items-center gap-4 text-sm text-slate-500"
            >
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+5}`} alt="User" />
                        </div>
                    ))}
                </div>
                <p>Loved by 10,000+ creators • Powered by Google Gemini</p>
            </motion.div>
          </div>

          {/* Hero Visual Animation */}
          <div className="relative">
             <HeroAnimation />
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Visual Examples Section */}
      <VisualExamplesSection />

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 skew-y-3 origin-bottom-left transform translate-y-20 z-0"></div>
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-3xl p-12 md:p-20 text-center relative z-10 shadow-2xl shadow-indigo-900/40 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
                Ready to visualize your data?
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-indigo-100 text-xl max-w-2xl mx-auto mb-10"
            >
                Join thousands of users creating professional reports in seconds. No credit card required.
            </motion.p>
            <motion.button 
                onClick={onStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
                Start Creating Now
            </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
             <div className="col-span-2">
                 <div className="flex items-center gap-2 mb-6 text-white">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5 14C5 12.8954 5.89543 12 7 12H9C10.1046 12 11 12.8954 11 14V21H7C5.89543 21 5 20.1046 5 19V14Z" fillOpacity="0.7" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M13 7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V21H15C13.8954 21 13 20.1046 13 19V7Z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold">ChartGenius</span>
                 </div>
                 <p className="max-w-sm mb-6">
                     Empowering storytellers with instant, beautiful data visualizations powered by advanced AI.
                 </p>
                 <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                         <span className="sr-only">Twitter</span>
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                         <span className="sr-only">GitHub</span>
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                     </a>
                 </div>
             </div>
             
             <div>
                 <h4 className="text-white font-bold mb-6">Product</h4>
                 <ul className="space-y-4">
                     <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-indigo-400 transition-colors">Features</a></li>
                     <li><a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-indigo-400 transition-colors">How It Works</a></li>
                     <li><a href="#examples" onClick={(e) => scrollToSection(e, 'examples')} className="hover:text-indigo-400 transition-colors">Examples</a></li>
                 </ul>
             </div>

             <div>
                 <h4 className="text-white font-bold mb-6">Connect</h4>
                 <ul className="space-y-4">
                     <li>
                        <button 
                            onClick={() => setIsContactModalOpen(true)} 
                            className="hover:text-indigo-400 transition-colors text-left"
                        >
                            Contact Support
                        </button>
                     </li>
                     <li><button onClick={onLogin} className="hover:text-indigo-400 transition-colors text-left">Log In</button></li>
                     <li><button onClick={onStart} className="hover:text-indigo-400 transition-colors text-left">Get Started</button></li>
                 </ul>
             </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm">
             <p>&copy; 2024 ChartGenius. All rights reserved.</p>
             <div className="flex gap-6 mt-4 md:mt-0">
                 <button onClick={() => onViewPage('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                 <button onClick={() => onViewPage('terms')} className="hover:text-white transition-colors">Terms of Service</button>
             </div>
          </div>
      </footer>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Counter = ({ from, to, duration, prefix = "", suffix = "" }: { from: number; to: number; duration: number, prefix?: string, suffix?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        if (node) {
            node.textContent = prefix + Math.floor(value).toLocaleString() + suffix;
        }
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [from, to, duration, prefix, suffix]);

  return <span ref={nodeRef} />;
};

// --- SUB-SECTIONS ---

const AnimatedIcon = ({ type, color }: { type: string, color: string }) => {
    const isHovered = useMotionValue(0); // 0 = false, 1 = true
    
    // Helper colors
    const primary = color.split(' ')[2]?.replace('text-', '') || 'indigo-600';
    
    switch(type) {
        case 'content-creators':
            return (
                <div className="relative w-12 h-12">
                   <motion.div 
                     className="absolute inset-0 border-2 border-current rounded-lg opacity-30"
                     animate={{ rotate: [0, 5, 0] }}
                     transition={{ duration: 4, repeat: Infinity }}
                   />
                   <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute top-2 left-2 w-8 h-8">
                        <motion.path 
                           d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                           initial={{ pathLength: 1 }}
                        />
                        <motion.path 
                           d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                           animate={{ y: [0, -3, 0], x: [0, 2, 0] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                   </motion.svg>
                </div>
            );
        case 'business-analysts':
             return (
                <div className="relative w-12 h-12 flex items-end justify-center gap-1 pb-1">
                   {[0.4, 0.7, 1, 0.6].map((h, i) => (
                       <motion.div 
                          key={i}
                          className="w-2 bg-current rounded-t-sm"
                          initial={{ height: h * 20 }}
                          animate={{ height: [h * 20, h * 35, h * 20] }}
                          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                       />
                   ))}
                </div>
             );
        case 'students':
             return (
                 <div className="relative w-12 h-12 flex items-center justify-center">
                    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                        <motion.path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <motion.path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </motion.svg>
                    <motion.div 
                        className="absolute top-1 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                 </div>
             );
        case 'researchers':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                         <path d="M6 18h8" />
                         <path d="M3 22h18" />
                         <path d="M14 22a7 7 0 1 0 0-14h-1" />
                         <path d="M9 14h2" />
                         <path d="M9 12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8" />
                    </svg>
                    <motion.div 
                        className="absolute top-1 left-5 w-3 h-3 bg-current rounded-full opacity-50"
                        animate={{ y: -10, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                     <motion.div 
                        className="absolute top-3 left-7 w-2 h-2 bg-current rounded-full opacity-50"
                        animate={{ y: -10, opacity: 0 }}
                        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
                    />
                </div>
            );
        case 'journalists':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                     <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                        <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                     </motion.svg>
                     <motion.div 
                        className="absolute bottom-2 right-2 w-3 h-3 bg-red-500 rounded-full"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                     />
                </div>
            );
         case 'marketing':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                        <path d="M12 20V10" />
                        <path d="M18 20V4" />
                        <path d="M6 20v-4" />
                     </svg>
                     <motion.path 
                        d="M2 22h20" 
                        stroke="currentColor" 
                        strokeWidth="2"
                     />
                     <motion.div 
                         className="absolute top-2 right-1 w-4 h-4"
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                             <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
                        </svg>
                     </motion.div>
                </div>
            );
        default: return null;
    }
}

const UseCasesSection = () => {
    const personas = [
        {
            title: "Content Creators",
            desc: "Turn dull text into engaging visual stories.",
            tag: "Blog Posts",
            iconType: "content-creators",
            color: "bg-pink-50 text-pink-600 border-pink-100",
            shadow: "shadow-pink-100",
            delay: 0
        },
        {
            title: "Business Analysts",
            desc: "Automate your quarterly reporting process.",
            tag: "QBR Reports",
            iconType: "business-analysts",
            color: "bg-blue-50 text-blue-600 border-blue-100",
            shadow: "shadow-blue-100",
            delay: 0.1
        },
        {
            title: "Students & Educators",
            desc: "Make academic papers pop with clear data.",
            tag: "Theses",
            iconType: "students",
            color: "bg-amber-50 text-amber-600 border-amber-100",
            shadow: "shadow-amber-100",
            delay: 0.2
        },
        {
            title: "Researchers",
            desc: "Visualize findings for faster publication.",
            tag: "Journals",
            iconType: "researchers",
            color: "bg-teal-50 text-teal-600 border-teal-100",
            shadow: "shadow-teal-100",
            delay: 0.3
        },
        {
            title: "Journalists",
            desc: "Add data credibility to your news pieces.",
            tag: "Articles",
            iconType: "journalists",
            color: "bg-slate-50 text-slate-600 border-slate-200",
            shadow: "shadow-slate-200",
            delay: 0.4
        },
        {
            title: "Marketing Teams",
            desc: "Showcase campaign ROI with instant charts.",
            tag: "Decks",
            iconType: "marketing",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100",
            shadow: "shadow-indigo-100",
            delay: 0.5
        }
    ];

    return (
        <section id="use-cases" className="py-24 bg-white relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 skew-x-12 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                     <div className="max-w-2xl">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-indigo-600 font-bold tracking-wider uppercase text-xs bg-indigo-50 px-3 py-1 rounded-full mb-4 inline-block"
                        >
                            Who It's For
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
                        >
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Storytellers</span>
                        </motion.h2>
                     </div>
                     <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-slate-500 max-w-sm"
                     >
                        Whether you're presenting to a board or publishing a blog, we adapt to you.
                     </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personas.map((persona, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: persona.delay, type: "spring", stiffness: 50 }}
                            whileHover={{ y: -8 }}
                            className={`group relative p-8 rounded-3xl bg-white border border-slate-100 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-2xl ${persona.shadow}`}
                        >
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-current" style={{ color: persona.color.split(' ')[1].replace('text-', 'bg-').replace('600', '100') }}></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 ${persona.color}`}>
                                    <AnimatedIcon type={persona.iconType} color={persona.color} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border bg-white ${persona.color.split(' ')[1]} border-current opacity-60`}>
                                    {persona.tag}
                                </span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {persona.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {persona.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    return (
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                    <StatItem 
                        icon="∞" 
                        label="Charts Generated" 
                        desc="Unlimited" 
                        color="text-indigo-400"
                    />
                    <StatItem 
                        number={30} 
                        suffix="s" 
                        prefix="<"
                        label="Processing Time" 
                        desc="Fast Analysis" 
                        color="text-emerald-400"
                    />
                     <StatItem 
                        number={50} 
                        suffix="+"
                        label="Languages" 
                        desc="RTL Support" 
                        color="text-amber-400"
                    />
                     <StatItem 
                        number={10} 
                        suffix="+"
                        label="Chart Types" 
                        desc="Auto-Selected" 
                        color="text-pink-400"
                    />
                    <StatItem 
                        number={0} 
                        prefix="$"
                        label="Cost Forever" 
                        desc="100% Free" 
                        color="text-blue-400"
                    />
                    <StatItem 
                        text="2.5" 
                        label="Gemini Powered" 
                        desc="Latest AI Model" 
                        color="text-purple-400"
                    />
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ number, text, icon, prefix, suffix, label, desc, color }: any) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group p-4"
        >
            <div className={`text-4xl md:text-5xl font-bold mb-2 ${color} flex justify-center items-center h-16`}>
                {icon ? (
                    <span className="group-hover:rotate-180 transition-transform duration-700 block">{icon}</span>
                ) : text ? (
                    <span>{text}</span>
                ) : (
                    <Counter from={0} to={number} duration={2} prefix={prefix} suffix={suffix} />
                )}
            </div>
            <div className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{label}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </motion.div>
    )
}

function SpotlightCard({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-slate-200 bg-white overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

const FeaturesSection = () => {
    const features = [
        {
            title: "Smart AI Detection",
            desc: "Google Gemini AI scans your text to intelligently identify numerical data points and relationships suitable for visualization.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Versatile Visualizations",
            desc: "From bar charts to complex radar graphs. The AI automatically selects the most effective chart type for your specific dataset.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Instant Results",
            desc: "Get professionally designed charts in under 30 seconds. Copy, paste, and let the engine do the heavy lifting.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: "RTL Language Support",
            desc: "Native support for right-to-left languages including Persian, Arabic, and Hebrew, ensuring correct text alignment and flow.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "PDF Export Ready",
            desc: "Download your enhanced articles as polished, high-resolution PDFs ready for presentation or printing.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            )
        },
        {
            title: "100% Free Forever",
            desc: "Democratizing data visualization. No credit cards, no hidden fees, just great tools accessible to everyone.",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            )
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
    };

    return (
        <section id="features" className="py-24 bg-slate-50 relative">
             <div className="max-w-7xl mx-auto px-6 relative z-10">
                 <div className="text-center mb-20 max-w-3xl mx-auto">
                     <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                     >
                        The <span className="text-indigo-600">Power</span> Suite
                     </motion.h2>
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500"
                     >
                        Everything you need to visualize your data, packaged in a professional, enterprise-grade interface.
                     </motion.p>
                 </div>

                 <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                 >
                     {features.map((feature, i) => (
                         <motion.div key={i} variants={itemVariants} className="h-full">
                            <SpotlightCard className="rounded-2xl p-8 h-full shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </SpotlightCard>
                         </motion.div>
                     ))}
                 </motion.div>
             </div>
        </section>
    );
};

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4"
                    >
                        How ChartGenius Works
                    </motion.h2>
                    <motion.p 
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Simple. Fast. Powerful.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "76%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="hidden md:block absolute top-12 left-[12%] h-0.5 bg-slate-200 border-t-2 border-dashed border-slate-300 z-0 origin-left"
                    ></motion.div>

                    {[
                        { title: "1. Paste Text", desc: "Copy your article or report.", icon: "📝", delay: 0 },
                        { title: "2. AI Analysis", desc: "Gemini AI detects data points.", icon: "🧠", delay: 0.4 },
                        { title: "3. Generate", desc: "Charts created instantly.", icon: "📊", delay: 0.8 },
                        { title: "4. Share", desc: "Download PDF or share link.", icon: "📤", delay: 1.2 }
                    ].map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step.delay }}
                            className="relative z-10 text-center group"
                        >
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center text-4xl mb-6 border-4 border-white group-hover:border-indigo-100 transition-all duration-300 relative z-10"
                            >
                                {step.icon}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                    {i + 1}
                                </div>
                            </motion.div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 text-sm">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const VisualExamplesSection = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
         if (!containerRef.current) return;
         const rect = containerRef.current.getBoundingClientRect();
         const touch = e.touches[0];
         const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
         const percentage = (x / rect.width) * 100;
         setSliderPosition(percentage);
    }

    // Auto-animate slightly on load to show interactivity
    useEffect(() => {
        const timer = setTimeout(() => {
            setSliderPosition(55);
            setTimeout(() => setSliderPosition(50), 400);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="examples" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs bg-indigo-50 px-3 py-1 rounded-full mb-4 inline-block">Visual Comparison</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">See ChartGenius in Action</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Drag the slider to see how we transform plain text into engaging, visual reports.
                    </p>
                </div>

                <div className="flex justify-center mb-4 text-sm font-bold text-slate-400 gap-20">
                     <span>BEFORE</span>
                     <span>AFTER</span>
                </div>

                <div 
                    ref={containerRef}
                    className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 select-none cursor-ew-resize group"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                >
                    {/* Before Layer (Bottom) */}
                    <div className="absolute inset-0 bg-slate-50 p-8 md:p-12 font-serif text-slate-600 leading-relaxed overflow-hidden pointer-events-none">
                        <div className="max-w-2xl mx-auto opacity-70 blur-[0.5px]">
                            <h3 className="text-3xl font-bold text-slate-800 mb-6 font-sans">Global Energy Report 2024</h3>
                            <p className="mb-6">
                                The global energy landscape is shifting rapidly. In 2024, renewable energy sources accounted for 29% of global electricity generation, a significant increase from previous years. Solar power led the charge with 12%, followed by wind at 10%, and hydro at 7%.
                            </p>
                            <p className="mb-6">
                                Despite this growth, fossil fuels remain dominant, generating 61% of total electricity. Coal usage dropped slightly to 34%, while natural gas remained steady at 23%. Nuclear power contributed the remaining 10% to the global mix.
                            </p>
                            <p>
                                Regional analysis shows Europe leading in renewable adoption, while Asia continues to rely heavily on coal for industrial expansion.
                            </p>
                        </div>
                    </div>

                    {/* After Layer (Top) */}
                    <div 
                        className="absolute inset-0 bg-white p-8 md:p-12 font-serif text-slate-800 leading-relaxed overflow-hidden pointer-events-none"
                        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                    >
                         <div className="max-w-2xl mx-auto">
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 font-sans">Global Energy Report 2024</h3>
                            <p className="mb-6">
                                The global energy landscape is shifting rapidly. In 2024, renewable energy sources accounted for <span className="bg-emerald-100 text-emerald-800 px-1 rounded font-bold">29%</span> of global electricity generation.
                            </p>
                            
                            {/* Inserted Chart */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="my-8 bg-white rounded-xl border border-slate-100 shadow-xl p-6 font-sans transform transition-transform duration-500"
                            >
                                <h4 className="font-bold text-slate-900 mb-1">Electricity Generation Mix</h4>
                                <p className="text-xs text-slate-400 mb-4">Global Source Distribution (2024)</p>
                                <div className="flex items-end justify-between h-32 gap-2 px-2">
                                     <ChartBar height="61%" label="Fossil" value="61%" color="bg-slate-400" delay={0} />
                                     <ChartBar height="29%" label="Renewable" value="29%" color="bg-emerald-500" delay={0.1} />
                                     <ChartBar height="10%" label="Nuclear" value="10%" color="bg-indigo-400" delay={0.2} />
                                </div>
                            </motion.div>

                            <p className="mb-6">
                                Despite this growth, fossil fuels remain dominant, generating 61% of total electricity. Coal usage dropped slightly to 34%, while natural gas remained steady at 23%.
                            </p>
                        </div>
                    </div>

                    {/* Slider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-indigo-600 cursor-ew-resize z-20 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-4 border-indigo-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                             <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
                             </svg>
                        </div>
                    </div>
                    
                    {/* Label Hints */}
                     <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">ORIGINAL</div>
                     <div className="absolute bottom-4 right-4 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">ENHANCED</div>
                </div>
            </div>
        </section>
    );
};

// --- ANIMATION COMPONENTS ---

const Highlight = ({ children, isActive, delay = 0 }: React.PropsWithChildren<{ isActive: boolean; delay?: number }>) => (
    <span className="relative inline-block mx-0.5">
        <motion.span
            className="absolute inset-0 bg-indigo-100 rounded -z-10"
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : 0 }}
            transition={{ delay: delay, duration: 0.4 }}
        />
        <span className={`relative transition-colors duration-300 ${isActive ? 'text-indigo-700 font-bold' : ''}`}>
            {children}
        </span>
    </span>
);

interface ChartBarProps {
    height: string;
    label: string;
    value: string;
    color: string;
    delay: number;
}

const ChartBar = ({ height, label, value, color, delay }: ChartBarProps) => (
    <motion.div 
        className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <motion.div 
            className={`w-full max-w-[60px] rounded-t-lg ${color} relative shadow-sm`}
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: delay + 0.2 }}
        >
             {/* Tooltip on hover simulation */}
             <motion.div 
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.8 }} // Auto show after animation
             >
                {value}
             </motion.div>
        </motion.div>
        <p className="mt-3 text-[10px] font-semibold text-slate-500 text-center">{label}</p>
    </motion.div>
);

const HeroAnimation = () => {
    const [step, setStep] = useState(0); 
    // 0: Idle (Empty editor)
    // 1: Typing (Text appears)
    // 2: Analyzing (Scanning effect)
    // 3: Result (Chart pops up)

    useEffect(() => {
        let mounted = true;

        const sequence = async () => {
            if (!mounted) return;
            // Loop forever
            while (mounted) {
                setStep(0);
                await new Promise(r => setTimeout(r, 1500)); // Pause empty
                if (!mounted) break;
                
                setStep(1); // Text typed
                await new Promise(r => setTimeout(r, 2000)); // Pause reading
                if (!mounted) break;
                
                setStep(2); // Analyzing
                await new Promise(r => setTimeout(r, 2500)); // Pause analyzing
                if (!mounted) break;
                
                setStep(3); // Chart shown
                await new Promise(r => setTimeout(r, 6000)); // Pause showing chart
                if (!mounted) break;
            }
        };

        sequence();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-500" style={{ perspective: 1000 }}>
            {/* Professional subtle diffuse shadow instead of glow */}
            <div className="absolute top-10 left-4 right-4 bottom-0 bg-slate-900/5 blur-3xl rounded-[3rem] -z-10"></div>
            
            <motion.div 
                className="relative bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Browser Toolbar */}
                <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="inline-block px-3 py-1 bg-white rounded-md text-[10px] font-medium text-slate-400 shadow-sm border border-slate-100 w-32">
                           chartgenius.app
                        </div>
                    </div>
                    <div className="w-8"></div> {/* Spacer for center alignment */}
                </div>

                {/* Editor Content */}
                <div className="p-6 h-[340px] flex flex-col relative bg-white">
                    {/* Placeholder Lines (Skeleton) */}
                    <div className="space-y-3 mb-6 opacity-30">
                         <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                         <div className="h-4 bg-slate-100 rounded w-full"></div>
                         <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    </div>

                    {/* Active Text Area Overlay */}
                    <AnimatePresence mode="wait">
                        {step >= 1 && (
                            <motion.div 
                                className="absolute top-6 left-6 right-6 z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="font-serif text-slate-800 text-sm leading-relaxed relative">
                                    {/* Scanning Beam */}
                                    {step === 2 && (
                                        <motion.div 
                                            className="absolute -left-4 -right-4 h-8 bg-indigo-500/10 border-y border-indigo-500/20 z-0"
                                            initial={{ top: -10, opacity: 0 }}
                                            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 1.5, ease: "linear", repeat: 0 }}
                                        />
                                    )}

                                    <span className="font-bold text-slate-900 block mb-2">Q3 Performance Summary</span>
                                    <p>
                                        Revenue across regions showed strong momentum. 
                                        North America led with <Highlight isActive={step >= 2}>$2.1M</Highlight>, 
                                        Europe followed at <Highlight isActive={step >= 2} delay={0.2}>$1.2M</Highlight>, 
                                        and Asia contributed <Highlight isActive={step >= 2} delay={0.4}>$0.9M</Highlight>.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <div className="mt-auto relative z-20 flex justify-end">
                         <motion.button
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg shadow-slate-200"
                            animate={{
                                scale: step === 2 ? 0.95 : 1,
                                opacity: step === 3 ? 0 : 1,
                                backgroundColor: step === 2 ? '#4F46E5' : '#0F172A' // Indigo to Slate
                            }}
                         >
                            {step === 2 ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>AI Processing...</span>
                                </>
                            ) : (
                                <>
                                   <span>Generate Report</span>
                                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                   </svg>
                                </>
                            )}
                         </motion.button>
                    </div>
                </div>

                {/* Result Chart Card */}
                <AnimatePresence>
                    {step === 3 && (
                        <motion.div 
                            className="absolute inset-x-4 bottom-4 top-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-6 flex flex-col z-30 overflow-hidden"
                            initial={{ y: 100, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Revenue by Region</h4>
                                    <p className="text-[10px] text-slate-400">Automated Insight • USD Millions</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-end justify-around gap-4 px-2 relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                                    <div className="border-t border-dashed border-slate-100 w-full h-px"></div>
                                    <div className="border-t border-dashed border-slate-100 w-full h-px"></div>
                                    <div className="border-t border-dashed border-slate-100 w-full h-px"></div>
                                    <div className="border-t border-slate-100 w-full h-px"></div>
                                </div>

                                <ChartBar height="80%" label="North America" value="$2.1M" color="bg-indigo-500" delay={0.1} />
                                <ChartBar height="45%" label="Europe" value="$1.2M" color="bg-indigo-400" delay={0.2} />
                                <ChartBar height="35%" label="Asia" value="$0.9M" color="bg-indigo-300" delay={0.3} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};