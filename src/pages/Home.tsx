import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Play, Dumbbell, Award, Brain } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { Timer } from '../components/ui/Timer';
import { AIRecommendationCard } from '../components/ai/AIRecommendation';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { userProfile, workouts, sessions } = useApp();
  const navigate = useNavigate();
  
  // Get the latest 2 workouts
  const recentWorkouts = workouts.slice(0, 2);
  
  // Mock AI recommendation
  const recommendation = {
    type: 'workout' as const,
    title: 'Try Upper Body Workout Today',
    description: 'Based on your recent activity, today would be ideal for an upper body workout focusing on shoulders and arms.',
  };

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">
          Welcome, {userProfile.name}
        </h1>
        <p className="text-text-secondary mt-1">
          Let's achieve your {userProfile.goal.replace('_', ' ')} goals together!
        </p>
      </motion.div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          className="h-14"
          icon={<Plus />}
          onClick={() => navigate('/workouts/create')}
        >
          New Workout
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          fullWidth
          className="h-14"
          icon={<Calendar />}
          onClick={() => navigate('/calendar')}
        >
          Schedule
        </Button>
      </div>
      
      {/* Timer section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play size={18} />
            Rest Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Timer compact />
        </CardContent>
      </Card>
      
      {/* AI recommendation */}
      <div>
        <h2 className="text-lg font-medium flex items-center gap-2 mb-3">
          <Brain size={18} className="text-primary" />
          AI Recommendation
        </h2>
        <AIRecommendationCard 
          recommendation={recommendation}
          onAccept={() => navigate('/workouts/create')}
        />
      </div>
      
      {/* Recent workouts */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Dumbbell size={18} className="text-primary" />
            Recent Workouts
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/workouts')}
          >
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout}
              onClick={() => navigate(`/workouts/${workout.id}`)}
              onSchedule={() => navigate(`/calendar?workoutId=${workout.id}`)}
            />
          ))}
          
          {recentWorkouts.length === 0 && (
            <div className="col-span-2 text-center py-10 text-text-secondary">
              <Dumbbell size={24} className="mx-auto mb-3 opacity-50" />
              <p>No workouts yet</p>
              <Button 
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/workouts/create')}
              >
                Create your first workout
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={18} />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-3xl font-bold">{userProfile.stats.workoutsCompleted}</p>
              <p className="text-sm text-text-secondary">Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{userProfile.stats.totalCaloriesBurned}</p>
              <p className="text-sm text-text-secondary">Calories</p>
            </div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            fullWidth
            className="mt-4"
            onClick={() => navigate('/stats')}
          >
            View detailed stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}