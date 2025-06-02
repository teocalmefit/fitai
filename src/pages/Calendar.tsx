import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CalendarView } from '../components/calendar/CalendarView';
import { useApp } from '../context/AppContext';
import { WorkoutCard } from '../components/workout/WorkoutCard';

export default function Calendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workouts, events, scheduleWorkout } = useApp();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Check if there's a workout ID in the query params
  const searchParams = new URLSearchParams(location.search);
  const workoutIdParam = searchParams.get('workoutId');
  
  // Filter workouts for the selected date
  const dateEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );
  
  // Handle scheduling a workout
  const handleScheduleWorkout = (workoutId: string) => {
    scheduleWorkout(workoutId, selectedDate.toISOString());
    setShowScheduleModal(false);
  };
  
  // If a workout ID is provided in the URL, show the schedule modal
  React.useEffect(() => {
    if (workoutIdParam) {
      setShowScheduleModal(true);
    }
  }, [workoutIdParam]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarIcon className="text-primary" size={24} />
        Workout Calendar
      </h1>
      
      {/* Calendar component */}
      <Card className="overflow-hidden">
        <CalendarView events={events} onDateSelect={setSelectedDate} />
      </Card>
      
      {/* Daily schedule */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setShowScheduleModal(true)}
          >
            Add Workout
          </Button>
        </div>
        
        {dateEvents.length > 0 ? (
          <div className="space-y-3">
            {dateEvents.map(event => {
              // Find the workout for this event
              const eventWorkout = workouts.find(w => w.id === event.workoutId);
              
              return eventWorkout ? (
                <WorkoutCard
                  key={event.id}
                  workout={eventWorkout}
                  onClick={() => navigate(`/workouts/${eventWorkout.id}`)}
                />
              ) : (
                <Card key={event.id}>
                  <div className="p-4">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-text-secondary">{event.type}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <p>No workouts scheduled for this day</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule a Workout
            </Button>
          </div>
        )}
      </div>
      
      {/* Schedule modal */}
      {showScheduleModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setShowScheduleModal(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-card rounded-xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Schedule Workout for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            
            <div className="space-y-3 mb-4">
              {workouts.map(workout => (
                <div
                  key={workout.id}
                  className="p-3 border border-surface rounded-lg cursor-pointer hover:bg-surface"
                  onClick={() => handleScheduleWorkout(workout.id)}
                >
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-text-secondary mt-1">
                    {workout.exercises.length} exercises • {formatDuration(workout.duration)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/workouts/create')}
              >
                Create New
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}