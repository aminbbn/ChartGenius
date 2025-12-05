import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  FunnelChart, Funnel, LabelList, RadialBarChart, RadialBar
} from 'recharts';
import { ChartConfig } from '../types';
import { toPng } from 'html-to-image';

interface ChartRendererProps {
  config: ChartConfig;
  onColorChange?: (color: string) => void;
  onRemove?: () => void;
  isRtl?: boolean;
}

// === Modern Color Palettes ===
const PALETTES = {
  // Primary (Indigo base)
  primary: ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'],
  // Success (Emerald base)
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  // Warm (Amber/Orange base)
  warm: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  // Cool (Cyan/Blue base)
  cool: ['#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC', '#CFFAFE'],
  // Mixed (Professional contrast)
  qualitative: [
    '#6366F1', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#0EA5E9', // Sky
    '#8B5CF6', // Violet
    '#F43F5E', // Rose
    '#14B8A6'  // Teal
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name || label;
    const color = payload[0].fill || payload[0].stroke || '#6366F1';
    
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-left min-w-[150px]" dir="ltr">
        <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{name}</p>
        </div>
        <p className="text-lg text-slate-900 font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    );
  }
  return null;
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, onColorChange, onRemove, isRtl = false }) => {
  const [activeColor, setActiveColor] = useState(config.color || PALETTES.qualitative[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Helper to get colors for multi-colored charts (Pie, Funnel, Radial)
  const getPalette = () => PALETTES.qualitative;

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    if (onColorChange) onColorChange(color);
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    setIsDownloading(true);
    try {
        // use html-to-image's toPng for better SVG and RTL support
        const dataUrl = await toPng(chartRef.current, {
            cacheBust: true,
            backgroundColor: '#ffffff',
            pixelRatio: 3, // Increased quality
            style: {
              // Explicitly force the font family during capture to ensure it renders correctly in the image
              fontFamily: isRtl ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'
            },
            filter: (node) => {
                // Exclude the toolbar div from the capture
                if (node.classList && node.classList.contains('chart-toolbar')) {
                    return false;
                }
                return true;
            },
            fetchRequestInit: {
                mode: 'cors'
            }
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${config.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
    } catch (err) {
        console.error("Download failed", err);
    } finally {
        setIsDownloading(false);
    }
  };

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="value" fill={activeColor} radius={[6, 6, 0, 0]} animationDuration={1200}>
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={activeColor} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'horizontalBar':
        return (
          <BarChart layout="vertical" data={config.data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="value" fill={activeColor} radius={[0, 6, 6, 0]} animationDuration={1200} barSize={24} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={activeColor} 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: activeColor }} 
              activeDot={{ r: 7, fill: activeColor, stroke: '#fff', strokeWidth: 2 }} 
              animationDuration={1500}
            />
          </LineChart>
        );

      case 'area':
        return (
            <AreaChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`colorValue-${config.id || 'chart'}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={activeColor}
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#colorValue-${config.id || 'chart'})`} 
                animationDuration={1500}
              />
            </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={config.data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
              cornerRadius={5}
            >
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPalette()[index % getPalette().length]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>} 
            />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={config.data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name={config.title}
              dataKey="value"
              stroke={activeColor}
              fill={activeColor}
              fillOpacity={0.4}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        );

      case 'funnel':
        return (
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={config.data}
              isAnimationActive
            >
              <LabelList position="right" fill="#64748B" stroke="none" dataKey="name" />
              {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPalette()[index % getPalette().length]} />
              ))}
            </Funnel>
          </FunnelChart>
        );

      case 'radialBar':
        return (
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="60%" 
            outerRadius="100%" 
            barSize={20} 
            data={config.data}
            startAngle={180}
            endAngle={0}
          >
            {/* Fix: For radial bars showing percentage or single scores, fix domain to 100 to avoid meaningless full circles */}
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
              background
              dataKey="value"
              cornerRadius={10}
              angleAxisId={0}
            >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPalette()[index % getPalette().length]} />
                ))}
            </RadialBar>
            <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                wrapperStyle={{ right: 0 }}
                formatter={(value) => <span className="text-slate-600 font-medium ml-1 text-xs">{value}</span>}
             />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        );

      default:
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Unsupported Chart Type: {config.type}
            </div>
        );
    }
  };

  return (
    <div 
        ref={chartRef}
        className={`my-10 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group relative ${isRtl ? 'font-persian' : 'font-sans'}`} 
        style={{ fontFamily: 'inherit' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-start">
        <div className="flex-1 px-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{config.title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{config.description}</p>
        </div>
        
        {/* Added class 'chart-toolbar' to allow filtering during image generation */}
        <div className={`chart-toolbar flex items-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Download Chart Image"
            >
                {isDownloading ? (
                   <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                )}
            </button>

             {/* Color Switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
                {PALETTES.qualitative.slice(0, 3).map(c => (
                    <button
                        key={c}
                        onClick={() => handleColorChange(c)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${activeColor === c ? 'ring-2 ring-offset-1 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                        style={{ backgroundColor: c }}
                        title="Change primary color"
                    />
                ))}
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="p-1.5 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors ml-1"
                    title="Remove Chart"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
      </div>
      
      <div className="p-6 h-[400px] w-full relative bg-white" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>Loading Chart...</div>}
        </ResponsiveContainer>
      </div>
      
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
        <span className="font-medium text-slate-400">Source: AI Analysis</span>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="uppercase font-bold tracking-widest text-[10px] text-slate-500">
                {config.type.replace(/([A-Z])/g, ' $1').trim()}
            </span>
        </div>
      </div>
    </div>
  );
};