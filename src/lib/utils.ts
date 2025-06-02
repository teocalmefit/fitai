import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, addDays, startOfWeek } from 'date-fns';

/**
 * Combines class names with Tailwind's merge utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Format a date string
 */
export function formatDate(date: Date | string, formatStr: string = 'PP'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, formatStr);
}

/**
 * Calculate calories burned (simplified estimation)
 * @param duration Duration in minutes
 * @param intensity Intensity factor (1-10)
 * @param weight User weight in kg
 */
export function calculateCalories(duration: number, intensity: number, weight: number = 70): number {
  // MET value approximation based on intensity (1-10)
  const metValue = 2 + (intensity * 0.8);
  // Calories = MET * weight in kg * duration in hours
  return Math.round(metValue * weight * (duration / 60));
}

/**
 * Convert weight between kg and lbs
 */
export function convertWeight(weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (from === to) return weight;
  return from === 'kg' ? weight * 2.20462 : weight / 2.20462;
}

/**
 * Format seconds to mm:ss
 */
export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get the days of the current week
 */
export function getDaysOfWeek(date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Format workout duration in a human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get a color based on intensity (for UI visualization)
 */
export function getIntensityColor(intensity: number): string {
  if (intensity <= 3) return 'bg-green-500';
  if (intensity <= 6) return 'bg-yellow-500';
  if (intensity <= 8) return 'bg-orange-500';
  return 'bg-red-500';
}