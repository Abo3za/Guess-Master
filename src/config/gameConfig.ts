import { Category } from '../types';

export interface PointOption {
  value: number;
  label: string;
  description: string;
}

export const RECOMMENDED_POINTS: PointOption[] = [
  { value: 100, label: 'سريعة', description: 'مباراة قصيرة (15-20 دقيقة)' },
  { value: 200, label: 'عادية', description: 'مباراة متوسطة (25-30 دقيقة)' },
  { value: 300, label: 'طويلة', description: 'مباراة طويلة (35-45 دقيقة)' },
];

export interface CategoryOption {
  id: Category;
  label: string;
  icon: string;
  bgImage: string;
}

export const DEFAULT_TEAMS = [
  { id: 1, name: 'الفريق الأول', score: 0, isActive: true },
  { id: 2, name: 'الفريق الثاني', score: 0, isActive: false }
];

export const DEFAULT_WINNING_POINTS = 200;
export const DEFAULT_HIDE_HINTS = false; 