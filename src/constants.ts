import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentación', icon: 'Utensils', color: 'bg-pink-200' },
  { id: '2', name: 'Transporte', icon: 'Car', color: 'bg-blue-200' },
  { id: '3', name: 'Ocio', icon: 'Gamepad2', color: 'bg-purple-200' },
  { id: '4', name: 'Hogar', icon: 'Home', color: 'bg-emerald-200' },
  { id: '5', name: 'Salud', icon: 'Heart', color: 'bg-rose-200' },
  { id: '6', name: 'Otros', icon: 'MoreHorizontal', color: 'bg-amber-200' },
];

export const PASTEL_COLORS = [
  'bg-pink-100', 'bg-blue-100', 'bg-purple-100', 'bg-emerald-100', 
  'bg-rose-100', 'bg-amber-100', 'bg-indigo-100', 'bg-teal-100',
  'bg-orange-100', 'bg-cyan-100'
];

export const ICONS = [
  'Utensils', 'Car', 'Gamepad2', 'Home', 'Heart', 'ShoppingBag', 
  'Coffee', 'Music', 'Book', 'Smartphone', 'Gift', 'MoreHorizontal'
];
