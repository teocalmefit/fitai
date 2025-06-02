import React, { ReactNode } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, Calendar, Activity, Timer, Settings, Dumbbell, Brain } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { activeTimerSeconds, isTimerRunning } = useApp();
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Stats', path: '/stats', icon: Activity },
    { name: 'AI Coach', path: '/ai', icon: Brain },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-surface sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitAI
          </h1>
        </div>
        
        {/* Active timer badge */}
        {activeTimerSeconds !== null && (
          <motion.div 
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
              isTimerRunning ? "bg-secondary" : "bg-surface"
            )}
            animate={{ scale: isTimerRunning ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: isTimerRunning ? Infinity : 0 }}
          >
            <Timer size={16} />
            <span>
              {Math.floor(activeTimerSeconds / 60)}:
              {(activeTimerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </motion.div>
        )}
      </header>
      
      {/* Main content */}
      <motion.main 
        className="flex-1 p-4 max-w-7xl mx-auto w-full"
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      
      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-surface z-10 px-1">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center p-1 rounded-lg transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-text-secondary hover:text-text-primary"
                )
              }
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Sidebar for desktop */}
      <nav className="hidden md:block fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-surface p-4">
        <div className="flex items-center gap-3 mb-8 mt-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitAI
          </h1>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-surface-light text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                )
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}