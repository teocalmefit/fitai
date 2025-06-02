export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  category: ExerciseCategory;
}

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'balance' | 'recovery';

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  calories: number;
  createdAt: string;
  lastPerformed?: string;
  nextScheduled?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  date: string;
  completed: boolean;
  exercises: CompletedExercise[];
  duration: number;
  calories: number;
  notes?: string;
}

export interface CompletedExercise extends Exercise {
  completedSets: {
    setNumber: number;
    reps: number;
    weight: number;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  goal: UserGoal;
  preferences: UserPreferences;
  stats: UserStats;
}

export type UserGoal = 
  | 'muscle_gain'
  | 'weight_loss'
  | 'endurance'
  | 'strength'
  | 'flexibility'
  | 'maintenance';

export interface UserPreferences {
  weightUnit: 'kg' | 'lbs';
  aiRecommendations: boolean;
  defaultRestTime: number;
  darkMode: boolean;
  notificationsEnabled: boolean;
  language: string; // Ajout de la langue
}

export interface UserStats {
  workoutsCompleted: number;
  totalWorkoutDuration: number;
  totalCaloriesBurned: number;
  totalWeightLifted: number;
  streakDays: number;
  startDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'workout' | 'rest' | 'goal';
  workoutId?: string;
  completed?: boolean;
}

export interface AiRecommendation {
  type: 'exercise' | 'workout' | 'rest' | 'progression';
  title: string;
  description: string;
  data?: any;
}