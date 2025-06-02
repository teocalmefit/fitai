import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CalendarEvent } from '../../types';
import { cn } from '../../lib/utils';

interface CalendarViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation handlers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Date selection handler
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onDateSelect(day);
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  return (
    <div className="w-full">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevMonth}
            icon={<ChevronLeft size={16} />}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextMonth}
            icon={<ChevronRight size={16} />}
          />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-text-secondary text-sm py-2 font-medium">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {monthDays.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const hasWorkout = dayEvents.some(event => event.type === 'workout');
          const hasCompleted = dayEvents.some(event => event.completed);
          
          return (
            <motion.div
              key={i}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative",
                isSelected ? "bg-primary/20" : "hover:bg-surface",
                isToday && !isSelected && "ring-2 ring-primary/30"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDateClick(day)}
            >
              <span 
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-primary" : "text-text-primary"
                )}
              >
                {format(day, 'd')}
              </span>
              
              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {hasWorkout && (
                    <div 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        hasCompleted ? "bg-success" : "bg-secondary"
                      )}
                    />
                  )}
                  
                  {dayEvents.some(event => event.type === 'rest') && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Selected date events */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-2">
          {getEventsForDay(selectedDate).length > 0 ? (
            getEventsForDay(selectedDate).map((event) => (
              <motion.div
                key={event.id}
                className={cn(
                  "p-3 rounded-lg border",
                  event.type === 'workout' && !event.completed && "border-secondary bg-secondary/10",
                  event.type === 'workout' && event.completed && "border-success bg-success/10",
                  event.type === 'rest' && "border-blue-500 bg-blue-500/10"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-sm text-text-secondary">
                    {format(new Date(event.date), 'hh:mm a')}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-text-secondary text-center py-4">
              No events for this day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};