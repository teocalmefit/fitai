import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Flame, ArrowRight } from 'lucide-react';
import { Workout } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate, formatDuration } from '../../lib/utils';

interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
  onSchedule?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onClick,
  onSchedule,
}) => {
  const { name, exercises, duration, calories, lastPerformed, nextScheduled } = workout;
  
  // Group exercises by category for the summary
  const categories = exercises.reduce<Record<string, number>>((acc, exercise) => {
    acc[exercise.category] = (acc[exercise.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card 
      className="h-full" 
      hoverEffect 
      glowEffect 
      glowColor="primary" 
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center gap-1 text-text-secondary text-sm">
            <Clock size={14} />
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary text-sm">
            <Flame size={14} />
            <span>{calories} kcal</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {Object.entries(categories).map(([category, count]) => (
            <Badge
              key={category}
              variant={
                category === 'strength' ? 'primary' :
                category === 'cardio' ? 'secondary' :
                category === 'flexibility' ? 'success' :
                'default'
              }
              size="sm"
            >
              {category} ({count})
            </Badge>
          ))}
        </div>
        
        <div className="text-sm text-text-secondary">
          <p>{exercises.length} exercises</p>
          
          {lastPerformed && (
            <p className="mt-1">
              Last performed: {formatDate(lastPerformed, 'MMM d, yyyy')}
            </p>
          )}
          
          {nextScheduled && (
            <div className="mt-2 flex items-center gap-1 text-primary">
              <Calendar size={14} />
              <span>Scheduled for {formatDate(nextScheduled, 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {onSchedule && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth 
            icon={<Calendar size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onSchedule();
            }}
          >
            Schedule
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};