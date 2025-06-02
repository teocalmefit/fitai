import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  glowColor?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Card = ({
  children,
  className,
  hoverEffect = false,
  glowEffect = false,
  glowColor = 'primary',
  onClick,
}: CardProps) => {
  const glowStyles = {
    primary: 'hover:shadow-glow-primary',
    secondary: 'hover:shadow-glow-secondary',
  };

  return (
    <motion.div
      className={cn(
        'bg-card rounded-xl p-4 border border-surface',
        hoverEffect && 'hover:bg-surface transition-colors cursor-pointer',
        glowEffect && glowStyles[glowColor],
        className
      )}
      whileHover={hoverEffect ? { y: -5 } : {}}
      whileTap={hoverEffect && onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('mb-3', className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn('text-lg font-bold', className)}>
      {children}
    </h3>
  );
};

export const CardContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('mt-3 flex items-center justify-between', className)}>
      {children}
    </div>
  );
};