import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserProfile, UserGoal, UserPreferences, Workout, WorkoutSession, CalendarEvent } from '../types';
import { generateId } from '../lib/utils';

// Initial user profile data
const defaultUserProfile: UserProfile = {
  id: 'user1',
  name: 'User',
  goal: 'strength',
  preferences: {
    weightUnit: 'kg',
    aiRecommendations: true,
    defaultRestTime: 60,
    darkMode: true,
    notificationsEnabled: true,
  },
  stats: {
    workoutsCompleted: 0,
    totalWorkoutDuration: 0,
    totalCaloriesBurned: 0,
    totalWeightLifted: 0,
    streakDays: 0,
    startDate: new Date().toISOString(),
  },
};

// Sample workouts
const sampleWorkouts: Workout[] = [
  {
    id: 'w1',
    name: 'Full Body Strength',
    exercises: [
      {
        id: 'e1',
        name: 'Squats',
        sets: 3,
        reps: 12,
        weight: 20,
        restTime: 60,
        category: 'strength',
      },
      {
        id: 'e2',
        name: 'Push-ups',
        sets: 3,
        reps: 15,
        weight: 0,
        restTime: 45,
        category: 'strength',
      },
      {
        id: 'e3',
        name: 'Bent Over Rows',
        sets: 3,
        reps: 12,
        weight: 15,
        restTime: 60,
        category: 'strength',
      },
    ],
    duration: 45,
    calories: 320,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w2',
    name: 'Cardio Blast',
    exercises: [
      {
        id: 'e4',
        name: 'Running',
        sets: 1,
        reps: 1,
        weight: 0,
        restTime: 0,
        category: 'cardio',
      },
      {
        id: 'e5',
        name: 'Jumping Jacks',
        sets: 3,
        reps: 30,
        weight: 0,
        restTime: 30,
        category: 'cardio',
      },
    ],
    duration: 30,
    calories: 250,
    createdAt: new Date().toISOString(),
  },
];

// Context type definition
interface AppContextType {
  userProfile: UserProfile;
  workouts: Workout[];
  sessions: WorkoutSession[];
  events: CalendarEvent[];
  activeTimerSeconds: number | null;
  isTimerRunning: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  updateGoal: (goal: UserGoal) => void;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => string;
  updateWorkout: (id: string, data: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  addSession: (session: Omit<WorkoutSession, 'id'>) => void;
  scheduleWorkout: (workoutId: string, date: string) => void;
  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // Timer state
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      
      const storedWorkouts = localStorage.getItem('workouts');
      if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
      
      const storedSessions = localStorage.getItem('sessions');
      if (storedSessions) setSessions(JSON.parse(storedSessions));
      
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));
    } catch (error) {
      console.error('Error loading data from localStorage', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning && activeTimerSeconds !== null) {
      const interval = window.setInterval(() => {
        setActiveTimerSeconds((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            setIsTimerRunning(false);
            // Play sound when timer ends
            try {
              const audio = new Audio('/timer-end.mp3');
              audio.play();
            } catch (error) {
              console.error('Error playing sound', error);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isTimerRunning, activeTimerSeconds]);

  // Context methods
  const updateProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const updatePreferences = (data: Partial<UserPreferences>) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...data },
    }));
  };

  const updateGoal = (goal: UserGoal) => {
    setUserProfile(prev => ({
      ...prev,
      goal,
    }));
  };

  const addWorkout = (workout: Omit<Workout, 'id' | 'createdAt'>) => {
    const id = generateId();
    const newWorkout = {
      ...workout,
      id,
      createdAt: new Date().toISOString(),
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    return id;
  };

  const updateWorkout = (id: string, data: Partial<Workout>) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id ? { ...workout, ...data } : workout
      )
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
    // Also remove associated events
    setEvents(prev => prev.filter(event => event.workoutId !== id));
  };

  const addSession = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession = {
      ...session,
      id: generateId(),
    };
    
    setSessions(prev => [...prev, newSession]);
    
    // Update user stats
    setUserProfile(prev => {
      const updatedStats = {
        workoutsCompleted: prev.stats.workoutsCompleted + 1,
        totalWorkoutDuration: prev.stats.totalWorkoutDuration + session.duration,
        totalCaloriesBurned: prev.stats.totalCaloriesBurned + session.calories,
        totalWeightLifted: prev.stats.totalWeightLifted + 
          session.exercises.reduce((total, ex) => 
            total + (ex.completedSets.reduce((setTotal, set) => 
              setTotal + (set.weight * set.reps), 0)), 0),
        streakDays: prev.stats.streakDays + 1, // Simplified streak calculation
        startDate: prev.stats.startDate,
      };
      
      return {
        ...prev,
        stats: updatedStats,
      };
    });
  };

  const scheduleWorkout = (workoutId: string, date: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    const newEvent: CalendarEvent = {
      id: generateId(),
      title: workout.name,
      date,
      type: 'workout',
      workoutId,
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Update the workout with next scheduled date
    updateWorkout(workoutId, { nextScheduled: date });
  };

  const startTimer = (seconds: number) => {
    setActiveTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setActiveTimerSeconds(null);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        workouts,
        sessions,
        events,
        activeTimerSeconds,
        isTimerRunning,
        updateProfile,
        updatePreferences,
        updateGoal,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addSession,
        scheduleWorkout,
        startTimer,
        pauseTimer,
        resetTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};