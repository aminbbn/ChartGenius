export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'horizontalBar' | 'radar' | 'funnel' | 'radialBar';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed. For MVP/Local, we store as is.
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartConfig {
  title: string;
  description: string;
  type: ChartType;
  xAxisLabel: string;
  yAxisLabel: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'chart';
  content?: string; // For text blocks
  chartConfig?: ChartConfig; // For chart blocks
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  blocks: ContentBlock[];
  error?: string;
}

export interface SavedDocument {
  id: string;
  userId: string; // Link document to a specific user
  title: string;
  excerpt: string;
  createdAt: number; // timestamp
  blocks: ContentBlock[];
  originalText: string;
  chartCount: number;
  direction: 'ltr' | 'rtl';
}