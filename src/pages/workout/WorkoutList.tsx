import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { WorkoutCard } from '../../components/workout/WorkoutCard';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function WorkoutList() {
  const navigate = useNavigate();
  const { workouts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  
  // Filter workouts based on search term and filters
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = filters.length === 0 || 
      workout.exercises.some(exercise => 
        filters.includes(exercise.category)
      );
    
    return matchesSearch && matchesFilters;
  });
  
  // Toggle category filter
  const toggleFilter = (category: string) => {
    if (filters.includes(category)) {
      setFilters(filters.filter(f => f !== category));
    } else {
      setFilters([...filters, category]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters([]);
    setSearchTerm('');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Available categories
  const categories = ['strength', 'cardio', 'flexibility', 'balance', 'recovery'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Workouts</h1>
        <Button 
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => navigate('/workouts/create')}
        >
          New
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            className="input w-full pl-10"
            placeholder="Search workouts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          {(searchTerm || filters.length > 0) && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              onClick={clearFilters}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {filters.length > 0 && (
            <div className="text-sm text-text-secondary">
              {filters.length} filter{filters.length !== 1 ? 's' : ''} applied
            </div>
          )}
        </div>
        
        {showFilters && (
          <Card className="bg-surface">
            <div className="p-3">
              <h3 className="text-sm font-medium mb-2">Filter by category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.includes(category) ? 'primary' : 'default'}
                    className={`cursor-pointer ${filters.includes(category) ? 'bg-primary/30' : ''}`}
                    onClick={() => toggleFilter(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Workout list */}
      {filteredWorkouts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredWorkouts.map(workout => (
            <motion.div key={workout.id} variants={itemVariants}>
              <WorkoutCard 
                workout={workout}
                onClick={() => navigate(`/workouts/${workout.id}`)}
                onSchedule={() => navigate(`/calendar?workoutId=${workout.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          {workouts.length === 0 ? (
            <div>
              <p className="text-text-secondary mb-4">No workouts yet</p>
              <Button 
                variant="primary"
                onClick={() => navigate('/workouts/create')}
                icon={<Plus size={18} />}
              >
                Create your first workout
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-text-secondary">No workouts match your filters</p>
              <Button 
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}