import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  className,
}) => {
  // Determine if the change is positive, negative, or neutral
  const changeDirection = change ? (change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral') : undefined;
  
  // Format the change percentage
  const formattedChange = change 
    ? `${change > 0 ? '+' : ''}${change}%` 
    : undefined;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm text-text-secondary">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <motion.p 
              className="text-2xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.p>
            
            {(change !== undefined && changeDirection) && (
              <span 
                className={cn(
                  "ml-2 text-sm",
                  changeDirection === 'positive' && "text-success",
                  changeDirection === 'negative' && "text-error",
                  changeDirection === 'neutral' && "text-text-secondary"
                )}
              >
                {formattedChange}
                {changeText && ` ${changeText}`}
              </span>
            )}
          </div>
        </div>
        
        <div 
          className={cn(
            "p-2 rounded-lg",
            "bg-gradient-to-br from-primary/20 to-secondary/20"
          )}
        >
          {icon}
        </div>
      </div>
      
      {/* Optional progress bar */}
      {change !== undefined && change !== 0 && (
        <div className="mt-3 h-1 w-full bg-surface rounded-full overflow-hidden">
          <motion.div 
            className={cn(
              "h-full",
              changeDirection === 'positive' && "bg-success",
              changeDirection === 'negative' && "bg-error",
              changeDirection === 'neutral' && "bg-text-secondary"
            )}
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(Math.abs(change), 100)}%` 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </Card>
  );
};