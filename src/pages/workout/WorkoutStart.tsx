import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronRight, CheckCircle, Timer, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Timer as TimerComponent } from '../../components/ui/Timer';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../lib/utils';

export default function WorkoutStart() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, addSession, startTimer } = useApp();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
  const [isResting, setIsResting] = useState(false);
  const [workoutStartTime] = useState(new Date());
  
  // Find the workout
  const workout = workouts.find((w) => w.id === id);
  
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
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const isLastSet = currentSetIndex === currentExercise.sets - 1;
  
  // Get completed sets for current exercise
  const exerciseCompletedSets = completedSets[currentExercise.id] || [];
  
  // Handle completing a set
  const completeSet = () => {
    // Update completed sets
    const updatedSets = {
      ...completedSets,
      [currentExercise.id]: [...(completedSets[currentExercise.id] || []), currentSetIndex],
    };
    setCompletedSets(updatedSets);
    
    // Start rest timer if not last set or if there's another exercise
    if (!isLastSet || !isLastExercise) {
      setIsResting(true);
      startTimer(currentExercise.restTime);
    }
    
    // Move to next set or exercise
    if (isLastSet) {
      if (isLastExercise) {
        // Workout complete - create session and navigate
        const endTime = new Date();
        const duration = Math.round((endTime.getTime() - workoutStartTime.getTime()) / 60000);
        
        // Ensure we include the last completed set in the session data
        const completedExercises = workout.exercises.map(exercise => ({
          ...exercise,
          completedSets: [...(completedSets[exercise.id] || []), exercise.id === currentExercise.id ? currentSetIndex : -1]
            .filter(setIndex => setIndex !== -1)
            .map(setIndex => ({
              setNumber: setIndex + 1,
              reps: exercise.reps,
              weight: exercise.weight,
            })),
        }));
        
        addSession({
          workoutId: workout.id,
          date: new Date().toISOString(),
          completed: true,
          exercises: completedExercises,
          duration,
          calories: workout.calories,
        });
        
        navigate(`/workouts/${workout.id}/complete`);
      } else {
        // Move to next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
      }
    } else {
      // Move to next set
      setCurrentSetIndex(currentSetIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(`/workouts/${id}`)}
        icon={<ArrowLeft size={16} />}
      >
        Back to Workout
      </Button>
      
      {/* Progress header */}
      <div>
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="primary">
            Exercise {currentExerciseIndex + 1}/{workout.exercises.length}
          </Badge>
          <Badge variant="secondary">
            Set {currentSetIndex + 1}/{currentExercise.sets}
          </Badge>
        </div>
      </div>
      
      {/* Current exercise */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-primary" style={{
          width: `${((currentExerciseIndex * currentExercise.sets + currentSetIndex) / 
            (workout.exercises.length * currentExercise.sets)) * 100}%`
        }} />
        
        <div className="p-6">
          <motion.div
            key={`${currentExerciseIndex}-${currentSetIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-xl font-bold mb-2">{currentExercise.name}</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-text-secondary text-sm">Sets</p>
                <p className="text-2xl font-bold">{currentSetIndex + 1}/{currentExercise.sets}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Reps</p>
                <p className="text-2xl font-bold">{currentExercise.reps}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Weight</p>
                <p className="text-2xl font-bold">{currentExercise.weight}kg</p>
              </div>
            </div>
            
            {isResting ? (
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Rest Time</h3>
                <TimerComponent 
                  defaultTime={currentExercise.restTime}
                  compact
                />
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setIsResting(false)}
                >
                  Skip Rest
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {Array.from({ length: currentExercise.sets }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full ${
                        exerciseCompletedSets.includes(index)
                          ? 'bg-success'
                          : index === currentSetIndex
                          ? 'bg-primary'
                          : 'bg-surface'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<CheckCircle size={20} />}
                  onClick={completeSet}
                >
                  Complete Set
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </Card>
      
      {/* Timer */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Quick Timer</h3>
          <TimerComponent compact />
        </div>
      </Card>
      
      {/* Next up preview */}
      {!isLastExercise && (
        <Card className="bg-surface">
          <div className="p-4">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Next Up</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {isLastSet ? workout.exercises[currentExerciseIndex + 1].name : currentExercise.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {isLastSet
                    ? `${workout.exercises[currentExerciseIndex + 1].sets} sets × ${
                        workout.exercises[currentExerciseIndex + 1].reps
                      } reps`
                    : `Set ${currentSetIndex + 2} of ${currentExercise.sets}`}
                </p>
              </div>
              <ChevronRight size={20} className="text-text-secondary" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}