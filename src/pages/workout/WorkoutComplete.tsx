import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Share2, ArrowRight, Clock, Flame, Dumbbell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../lib/utils';

export default function WorkoutComplete() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, sessions } = useApp();
  
  // Get the workout and latest session
  const workout = workouts.find(w => w.id === id);
  const latestSession = sessions
    .filter(s => s.workoutId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  if (!workout || !latestSession) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary mb-4">Session not found</p>
        <Button variant="primary" onClick={() => navigate('/workouts')}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Completion animation and header */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
        >
          <Trophy className="text-success" size={32} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          Workout Complete!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-secondary"
        >
          Great job completing {workout.name}
        </motion.p>
      </div>
      
      {/* Workout stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="text-center p-4">
          <Clock size={24} className="mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{formatDuration(latestSession.duration)}</p>
          <p className="text-sm text-text-secondary">Duration</p>
        </Card>
        
        <Card className="text-center p-4">
          <Flame size={24} className="mx-auto mb-2 text-secondary" />
          <p className="text-2xl font-bold">{latestSession.calories}</p>
          <p className="text-sm text-text-secondary">Calories</p>
        </Card>
        
        <Card className="text-center p-4">
          <Dumbbell size={24} className="mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold">
            {latestSession.exercises.reduce((total, ex) => 
              total + (ex.completedSets.length * ex.weight), 0)}kg
          </p>
          <p className="text-sm text-text-secondary">Total Weight</p>
        </Card>
      </motion.div>
      
      {/* Exercise summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="p-4">
            <h2 className="font-medium mb-3">Exercise Summary</h2>
            <div className="space-y-3">
              {latestSession.exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-text-secondary">
                      {exercise.completedSets.length} sets completed
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                      <div
                        key={setIndex}
                        className={`w-2 h-2 rounded-full ${
                          setIndex < exercise.completedSets.length
                            ? 'bg-success'
                            : 'bg-surface'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={<Calendar size={20} />}
          onClick={() => navigate('/calendar')}
        >
          Schedule Next Workout
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            icon={<Share2 size={18} />}
            onClick={() => {
              // Share functionality would go here
              alert('Sharing coming soon!');
            }}
          >
            Share Results
          </Button>
          
          <Button
            variant="outline"
            icon={<ArrowRight size={18} />}
            onClick={() => navigate(`/workouts/${id}`)}
          >
            View Workout
          </Button>
        </div>
      </motion.div>
    </div>
  );
}