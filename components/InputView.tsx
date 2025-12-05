import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { detectDirection } from '../services/storageService';

interface InputViewProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const DEMO_TEXT = `Quarterly Sales Performance Report - Q3 2024

Our company has seen remarkable growth this quarter, driven largely by the expansion of our enterprise software division. Total revenue for Q3 reached $4.2 million, marking a 15% increase from the previous quarter.

Breaking this down by region, North America continues to be our strongest market, contributing $2.1 million to the total. Europe followed with $1.2 million, while the Asia-Pacific region generated $0.9 million. This distribution highlights our continued dominance in the west, but also points to significant opportunities for expansion in eastern markets.

When we look at product categories, "Cloud Services" was the clear winner, bringing in 55% of all revenue. "On-premise Solutions" accounted for 30%, with "Consulting Services" making up the remaining 15%. This shift towards cloud revenue aligns with our long-term strategic goals.

Monthly trends show a steady upward trajectory. July started with $1.1 million, August saw a slight dip to $1.0 million due to seasonal factors, but September closed strong with a record-breaking $2.1 million as several major deals were finalized. We expect this momentum to carry into Q4.`;

const DEMO_TEXT_FA = `گزارش عملکرد فروش سه ماهه - پاییز ۱۴۰۳

شرکت ما در این فصل رشد قابل توجهی را تجربه کرده است که عمدتاً ناشی از گسترش بخش نرم‌افزارهای سازمانی ما است. کل درآمد برای پاییز به ۴.۲ میلیارد تومان رسید که نشان‌دهنده افزایش ۱۵ درصدی نسبت به فصل قبل است.

با بررسی تفکیکی بر اساس منطقه، تهران همچنان قوی‌ترین بازار ما است و ۲.۱ میلیارد تومان از کل درآمد را تأمین کرده است. اصفهان با ۱.۲ میلیارد تومان در رتبه بعدی قرار دارد، در حالی که منطقه خراسان ۰.۹ میلیارد تومان درآمد ایجاد کرده است.

وقتی به دسته‌بندی محصولات نگاه می‌کنیم، "خدمات ابری" برنده اصلی بود و ۵۵٪ از کل درآمد را به خود اختصاص داد. "راهکارهای محلی" ۳۰٪ و "خدمات مشاوره" ۱۵٪ باقی‌مانده را تشکیل دادند.

روند ماهانه یک مسیر صعودی ثابت را نشان می‌دهد. مهر ماه با ۱.۱ میلیارد تومان آغاز شد، آبان به دلیل عوامل فصلی کاهش جزئی به ۱.۰ میلیارد تومان داشت، اما آذر با رکوردشکنی ۲.۱ میلیارد تومان به پایان رسید.`;

export const InputView: React.FC<InputViewProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    if (text.length > 0) {
      setDirection(detectDirection(text));
    }
  }, [text]);

  const handleAnalyze = () => {
    if (text.trim().length > 50) {
      onAnalyze(text);
    }
  };

  const loadDemo = (lang: 'en' | 'fa') => {
    setText(lang === 'fa' ? DEMO_TEXT_FA : DEMO_TEXT);
  };

  const wordCount = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">New Analysis</h1>
           <p className="text-slate-500 text-sm">Create a new visual report from text.</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
            <button 
                onClick={() => loadDemo('en')}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors uppercase tracking-wider"
            >
                Load English Demo
            </button>
            <button 
                onClick={() => loadDemo('fa')}
                className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors uppercase tracking-wider font-persian"
            >
                نمونه فارسی
            </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2 text-xs font-medium text-slate-500 justify-between">
             <div className="flex items-center gap-2">
                 <span>EDITOR</span>
                 <span className="text-slate-300">|</span>
                 <span>Markdown Supported</span>
             </div>
             <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${direction === 'rtl' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {direction === 'rtl' ? 'Persian (RTL)' : 'English (LTR)'}
             </span>
        </div>
        
        <textarea
          className={`flex-1 w-full p-6 md:p-8 text-lg text-slate-700 placeholder-slate-400 bg-white focus:outline-none resize-none leading-relaxed appearance-none transition-all duration-300 ${
              direction === 'rtl' ? 'font-persian text-right' : 'font-serif text-left'
          }`}
          placeholder={direction === 'rtl' ? "متن خود را اینجا وارد کنید..." : "Start typing or paste your report content here..."}
          dir={direction}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
          spellCheck="false"
        />
        
        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
          <div className="text-sm text-slate-400">
             {wordCount} words
          </div>
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing}
            disabled={text.trim().length < 50}
            className="shadow-lg shadow-indigo-100"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          >
            {isAnalyzing ? 'Processing...' : 'Generate Report'}
          </Button>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100">
            <div className="text-xl">🔍</div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm">Auto Detection</h4>
                <p className="text-xs text-slate-500 mt-1">We automatically find data points in your text.</p>
            </div>
         </div>
         <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100">
            <div className="text-xl">📊</div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm">Smart Charts</h4>
                <p className="text-xs text-slate-500 mt-1">The best visualization type is selected for you.</p>
            </div>
         </div>
         <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100">
            <div className="text-xl">💾</div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm">Auto Save</h4>
                <p className="text-xs text-slate-500 mt-1">Reports are saved to your dashboard.</p>
            </div>
         </div>
      </div>
    </div>
  );
};