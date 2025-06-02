import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Calendar, Edit, ArrowLeft, Clock, Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Timer } from '../../components/ui/Timer';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDuration } from '../../lib/utils';

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, sessions, startTimer, scheduleWorkout } = useApp();
  
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  
  // Find the workout
  const workout = workouts.find((w) => w.id === id);
  
  // Find past sessions for this workout
  const workoutSessions = sessions.filter((s) => s.workoutId === id);
  
  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary mb-4">Workout not found</p>
        <Button variant="primary" onClick={() => navigate('/workouts')}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/workouts')}
        icon={<ArrowLeft size={16} />}
      >
        Back to Workouts
      </Button>
      
      {/* Workout header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-text-secondary">
            <Clock size={16} />
            <span>{formatDuration(workout.duration)}</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary">
            <Flame size={16} />
            <span>{workout.calories} kcal</span>
          </div>
          {workout.lastPerformed && (
            <div className="flex items-center gap-1 text-text-secondary">
              <Calendar size={16} />
              <span>Last: {formatDate(workout.lastPerformed, 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3">
        <Button 
          variant="primary" 
          fullWidth 
          icon={<Play size={18} />}
          onClick={() => navigate(`/workouts/${id}/start`)}
        >
          Start Workout
        </Button>
        <Button 
          variant="outline" 
          icon={<Calendar size={18} />}
          onClick={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            scheduleWorkout(workout.id, tomorrow.toISOString());
            navigate('/calendar');
          }}
        >
          Schedule
        </Button>
        <Button 
          variant="ghost" 
          icon={<Edit size={18} />}
          onClick={() => navigate(`/workouts/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
      
      {/* Exercise list */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Exercises</h2>
        <div className="space-y-3">
          {workout.exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {exercise.name}
                      <Badge
                        variant={
                          exercise.category === 'strength' ? 'primary' :
                          exercise.category === 'cardio' ? 'secondary' :
                          exercise.category === 'flexibility' ? 'success' :
                          'default'
                        }
                        size="sm"
                      >
                        {exercise.category}
                      </Badge>
                    </CardTitle>
                    <div className="text-text-secondary text-sm mt-1">
                      {exercise.sets} sets &times; {exercise.reps} reps
                      {exercise.weight > 0 && ` • ${exercise.weight}kg`}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={expandedExercise === exercise.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    onClick={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                  />
                </div>
              </CardHeader>
              
              {expandedExercise === exercise.id && (
                <CardContent className="pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-xs text-text-secondary mb-1">Rest Time</h4>
                      <div className="flex items-center">
                        <span>{exercise.restTime} seconds</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => startTimer(exercise.restTime)}
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-text-secondary mb-1">Weight</h4>
                      <p>{exercise.weight > 0 ? `${exercise.weight}kg` : 'Bodyweight'}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      {/* Timer section */}
      <Card>
        <CardHeader>
          <CardTitle>Rest Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <Timer defaultTime={60} />
        </CardContent>
      </Card>
      
      {/* Workout history */}
      {workoutSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Workout History</h2>
          <div className="space-y-2">
            {workoutSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{formatDate(session.date, 'MMM d, yyyy')}</div>
                      <div className="text-xs text-text-secondary">
                        {formatDuration(session.duration)} • {session.calories} kcal
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}