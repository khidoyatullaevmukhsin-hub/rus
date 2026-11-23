import { TeamColorKey } from '../types/quiz';

export interface TeamColorStyle {
  border: string;
  activeBorder: string;
  bg: string;
  activeBg: string;
  accentText: string;
  dot: string;
  button: string;
}

export const TEAM_COLOR_STYLES: Record<TeamColorKey, TeamColorStyle> = {
  emerald: {
    border: 'border-emerald-300',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/25',
    bg: 'bg-white',
    activeBg: 'bg-emerald-50/70',
    accentText: 'text-emerald-800',
    dot: 'bg-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  amber: {
    border: 'border-amber-300',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/25',
    bg: 'bg-white',
    activeBg: 'bg-amber-50/70',
    accentText: 'text-amber-800',
    dot: 'bg-amber-500',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  rose: {
    border: 'border-rose-300',
    activeBorder: 'border-rose-500 ring-2 ring-rose-500/25',
    bg: 'bg-white',
    activeBg: 'bg-rose-50/70',
    accentText: 'text-rose-800',
    dot: 'bg-rose-500',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  sky: {
    border: 'border-sky-300',
    activeBorder: 'border-sky-600 ring-2 ring-sky-500/25',
    bg: 'bg-white',
    activeBg: 'bg-sky-50/70',
    accentText: 'text-sky-800',
    dot: 'bg-sky-500',
    button: 'bg-sky-600 hover:bg-sky-700 text-white',
  },
  violet: {
    border: 'border-violet-300',
    activeBorder: 'border-violet-600 ring-2 ring-violet-500/25',
    bg: 'bg-white',
    activeBg: 'bg-violet-50/70',
    accentText: 'text-violet-800',
    dot: 'bg-violet-500',
    button: 'bg-violet-600 hover:bg-violet-700 text-white',
  },
  teal: {
    border: 'border-teal-300',
    activeBorder: 'border-teal-600 ring-2 ring-teal-500/25',
    bg: 'bg-white',
    activeBg: 'bg-teal-50/70',
    accentText: 'text-teal-800',
    dot: 'bg-teal-600',
    button: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
};
