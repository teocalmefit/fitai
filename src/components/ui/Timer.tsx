import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { formatSeconds } from '../../lib/utils';

interface TimerProps {
  defaultTime?: number;
  compact?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  defaultTime = 60,
  compact = false 
}) => {
  const { 
    activeTimerSeconds, 
    isTimerRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer 
  } = useApp();
  
  const [customTime, setCustomTime] = useState(defaultTime);
  const currentTime = activeTimerSeconds ?? 0;
  
  // Calculate progress percentage
  const progress = activeTimerSeconds !== null
    ? (activeTimerSeconds / defaultTime) * 100
    : 100;
  
  const handleStart = () => {
    startTimer(customTime);
  };
  
  const handleReset = () => {
    resetTimer();
    setCustomTime(defaultTime);
  };
  
  // Presets in seconds
  const presets = [30, 60, 90, 120, 180, 300];
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div 
          className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-lg font-bold relative overflow-hidden"
          animate={{ 
            scale: isTimerRunning ? [1, 1.05, 1] : 1
          }}
          transition={{ 
            duration: 1, 
            repeat: isTimerRunning ? Infinity : 0 
          }}
        >
          {/* Progress circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/20"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-secondary"
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span>{formatSeconds(currentTime).split(':')[1]}</span>
        </motion.div>
        
        <Button 
          variant={isTimerRunning ? 'outline' : 'primary'} 
          size="sm"
          icon={isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
          onClick={isTimerRunning ? pauseTimer : handleStart}
        >
          {isTimerRunning ? 'Pause' : 'Start'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-6">
        {/* Timer display */}
        <motion.div 
          className="w-40 h-40 rounded-full bg-surface flex items-center justify-center text-4xl font-bold relative"
          animate={{ 
            scale: isTimerRunning ? [1, 1.03, 1] : 1
          }}
          transition={{ 
            duration: 1.5, 
            repeat: isTimerRunning ? Infinity : 0 
          }}
        >
          {/* Progress circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary/20"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-secondary"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              strokeLinecap="round"
              initial={false}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 70 * (1 - progress / 100)
              }}
              transition={{ 
                duration: 0.3
              }}
            />
          </svg>
          
          {activeTimerSeconds !== null ? (
            <span>{formatSeconds(currentTime)}</span>
          ) : (
            <div className="flex flex-col items-center">
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(parseInt(e.target.value) || defaultTime)}
                className="w-16 bg-transparent text-center text-3xl outline-none"
                min="5"
                max="3600"
              />
              <span className="text-sm text-text-secondary">seconds</span>
            </div>
          )}
        </motion.div>
        
        {/* Timer controls */}
        <div className="flex gap-3">
          <Button 
            variant={isTimerRunning ? 'outline' : 'primary'} 
            size="lg"
            icon={isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            onClick={isTimerRunning ? pauseTimer : handleStart}
          >
            {isTimerRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            icon={<RotateCcw size={18} />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
        
        {/* Presets */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4">
          {presets.map(preset => (
            <Button
              key={preset}
              variant="ghost"
              size="sm"
              onClick={() => {
                resetTimer();
                setCustomTime(preset);
              }}
              className={cn(
                "border border-surface",
                customTime === preset && "bg-surface"
              )}
            >
              {formatSeconds(preset)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}