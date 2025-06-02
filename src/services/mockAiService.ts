import { AiRecommendation, UserGoal, Workout, WorkoutSession } from '../types';

/**
 * Mock AI service to generate workout and exercise recommendations
 * This simulates what would normally be a backend ML service or GPT API call
 */
export const mockAiService = {
  /**
   * Generate workout recommendations based on user goals and history
   */
  getWorkoutRecommendations(
    userGoal: UserGoal,
    workoutHistory: WorkoutSession[],
    currentWorkouts: Workout[]
  ): AiRecommendation[] {
    // Basic recommendations based on user goal
    const baseRecommendations: Record<UserGoal, AiRecommendation[]> = {
      muscle_gain: [
        {
          type: 'workout',
          title: 'Progressive Overload Focus',
          description: 'Increase your weights by 5% this week to stimulate muscle growth.',
        },
        {
          type: 'exercise',
          title: 'Add Compound Movements',
          description: 'Include more compound exercises like deadlifts and bench press for maximum muscle gain.',
        },
      ],
      weight_loss: [
        {
          type: 'workout',
          title: 'HIIT Session Recommendation',
          description: 'Add a 20-minute HIIT session to boost your calorie burn and metabolic rate.',
        },
        {
          type: 'exercise',
          title: 'Superset Recommendation',
          description: 'Try supersets to increase workout density and calorie expenditure.',
        },
      ],
      endurance: [
        {
          type: 'progression',
          title: 'Endurance Progression',
          description: 'Gradually increase your cardio duration by 10% each week to build endurance.',
        },
        {
          type: 'workout',
          title: 'Interval Training',
          description: 'Incorporate interval training to improve cardiovascular capacity and endurance.',
        },
      ],
      strength: [
        {
          type: 'exercise',
          title: 'Strength Focus: Lower Reps',
          description: 'Decrease your reps and increase weight for your compound lifts to maximize strength gains.',
        },
        {
          type: 'rest',
          title: 'Recovery Reminder',
          description: 'Ensure 48 hours of rest for muscle groups before training them again for optimal strength development.',
        },
      ],
      flexibility: [
        {
          type: 'workout',
          title: 'Dynamic Stretching Routine',
          description: 'Add a 15-minute dynamic stretching routine before your strength workouts.',
        },
        {
          type: 'exercise',
          title: 'Yoga Flow Integration',
          description: 'Consider adding a yoga flow session once a week to improve overall mobility and flexibility.',
        },
      ],
      maintenance: [
        {
          type: 'workout',
          title: 'Workout Variety',
          description: 'Mix up your routine every 2-3 weeks to prevent plateaus and maintain interest.',
        },
        {
          type: 'rest',
          title: 'Active Recovery Day',
          description: 'Schedule an active recovery day with light activity to promote blood flow and recovery.',
        },
      ],
    };
    
    // Get base recommendations for the user's goal
    const recommendations = [...baseRecommendations[userGoal]];
    
    // Add personalized recommendations based on workout history
    if (workoutHistory.length > 0) {
      // Check if user has been consistent
      const isConsistent = workoutHistory.length >= 3;
      
      if (isConsistent) {
        recommendations.push({
          type: 'progression',
          title: 'Great Consistency!',
          description: 'You\'ve been consistent with your workouts. Consider increasing intensity by 10% this week.',
        });
      }
      
      // Check if user has been focusing on certain muscle groups
      const exerciseTypes = workoutHistory
        .flatMap(session => session.exercises)
        .map(ex => ex.category);
      
      const needsUpperBody = !exerciseTypes.includes('strength');
      const needsCardio = !exerciseTypes.includes('cardio');
      
      if (needsUpperBody) {
        recommendations.push({
          type: 'workout',
          title: 'Add Upper Body Training',
          description: 'Your recent workouts are missing upper body exercises. Consider adding a dedicated upper body session.',
        });
      }
      
      if (needsCardio) {
        recommendations.push({
          type: 'workout',
          title: 'Add Cardio Training',
          description: 'Consider adding a cardio session to balance your training and improve cardiovascular health.',
        });
      }
    } else {
      // For new users
      recommendations.push({
        type: 'workout',
        title: 'Start with Fundamentals',
        description: 'Begin with full-body workouts 2-3 times per week focusing on fundamental movements.',
      });
    }
    
    // Randomize and limit recommendations
    return recommendations
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  },
  
  /**
   * Generate exercise recommendations based on user goals and preferences
   */
  getExerciseRecommendations(userGoal: UserGoal): { name: string; category: string }[] {
    // Sample exercises by category and goal
    const exercisesByGoal: Record<UserGoal, { name: string; category: string }[]> = {
      muscle_gain: [
        { name: 'Bench Press', category: 'strength' },
        { name: 'Barbell Squats', category: 'strength' },
        { name: 'Deadlifts', category: 'strength' },
        { name: 'Pull-ups', category: 'strength' },
        { name: 'Shoulder Press', category: 'strength' },
      ],
      weight_loss: [
        { name: 'Burpees', category: 'cardio' },
        { name: 'Mountain Climbers', category: 'cardio' },
        { name: 'Jump Rope', category: 'cardio' },
        { name: 'Kettlebell Swings', category: 'strength' },
        { name: 'Box Jumps', category: 'cardio' },
      ],
      endurance: [
        { name: 'Running', category: 'cardio' },
        { name: 'Cycling', category: 'cardio' },
        { name: 'Rowing', category: 'cardio' },
        { name: 'Swimming', category: 'cardio' },
        { name: 'Stair Climber', category: 'cardio' },
      ],
      strength: [
        { name: 'Heavy Squats', category: 'strength' },
        { name: 'Deadlifts', category: 'strength' },
        { name: 'Bench Press', category: 'strength' },
        { name: 'Overhead Press', category: 'strength' },
        { name: 'Barbell Rows', category: 'strength' },
      ],
      flexibility: [
        { name: 'Yoga Flow', category: 'flexibility' },
        { name: 'Dynamic Stretching', category: 'flexibility' },
        { name: 'Pilates', category: 'flexibility' },
        { name: 'Mobility Drills', category: 'flexibility' },
        { name: 'Foam Rolling', category: 'recovery' },
      ],
      maintenance: [
        { name: 'Circuit Training', category: 'strength' },
        { name: 'HIIT Workout', category: 'cardio' },
        { name: 'Bodyweight Exercises', category: 'strength' },
        { name: 'Yoga', category: 'flexibility' },
        { name: 'Swimming', category: 'cardio' },
      ],
    };
    
    // Get exercises for the user's goal
    const goalExercises = exercisesByGoal[userGoal];
    
    // Add some variety by including exercises from other categories
    const otherGoals = Object.keys(exercisesByGoal).filter(
      (goal) => goal !== userGoal
    ) as UserGoal[];
    
    const randomGoal = otherGoals[Math.floor(Math.random() * otherGoals.length)];
    const additionalExercises = exercisesByGoal[randomGoal].slice(0, 2);
    
    return [...goalExercises, ...additionalExercises];
  },
  
  /**
   * Suggest progression for an exercise
   */
  suggestProgression(exercise: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }): { sets: number; reps: number; weight: number } {
    // Simple progression logic based on exercise type
    const isBodyweight = exercise.weight === 0;
    
    if (isBodyweight) {
      // For bodyweight exercises, increase reps
      return {
        sets: exercise.sets,
        reps: Math.min(exercise.reps + 2, 30), // Cap at 30 reps
        weight: 0,
      };
    } else {
      // For weighted exercises, increase weight slightly or reps
      const shouldIncreaseWeight = Math.random() > 0.5;
      
      if (shouldIncreaseWeight) {
        // Increase weight by 5-10%
        const weightIncrease = exercise.weight * 0.05;
        return {
          sets: exercise.sets,
          reps: exercise.reps,
          weight: Math.round((exercise.weight + weightIncrease) * 10) / 10,
        };
      } else {
        // Increase reps
        return {
          sets: exercise.sets,
          reps: exercise.reps + 1,
          weight: exercise.weight,
        };
      }
    }
  },
};