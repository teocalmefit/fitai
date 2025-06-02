import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, ChevronDown, ChevronUp, ArrowLeft, Brain } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Exercise, Workout } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateId } from '../../lib/utils';
import { mockAiService } from '../../services/mockAiService';
import { cn } from '../../lib/utils';

export default function WorkoutCreate() {
  const navigate = useNavigate();
  const { addWorkout, userProfile } = useApp();
  
  // Form state
  const [name, setName] = useState('Mon Entraînement');
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>([
    {
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: userProfile.preferences.defaultRestTime,
      category: 'strength',
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  const exerciseRecommendations = mockAiService.getExerciseRecommendations(userProfile.goal);
  
  // Add a new exercise
  const addExercise = () => {
    setExercises([...exercises, {
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: userProfile.preferences.defaultRestTime,
      category: 'strength',
    }]);
  };
  
  // Remove an exercise
  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };
  
  // Update an exercise
  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: any) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value,
    };
    setExercises(newExercises);
  };

  // Calculate estimated workout duration
  const calculateDuration = () => {
    return exercises.reduce((total, exercise) => {
      const setTime = (exercise.reps * 3) + exercise.restTime;
      return total + (setTime * exercise.sets);
    }, 0) / 60;
  };

  // Calculate estimated calories
  const calculateCalories = (duration: number) => {
    const MET = 5; // Metabolic equivalent for moderate exercise
    const weight = 70; // Default weight in kg
    return Math.round((MET * 3.5 * weight * duration) / 200);
  };

  // Save the workout
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate
      if (!name.trim() || exercises.length === 0 || exercises.some(e => !e.name.trim())) {
        throw new Error('Veuillez remplir tous les champs');
      }
      
      // Calculate duration and calories
      const duration = Math.round(calculateDuration());
      const calories = calculateCalories(duration);
      
      // Create the workout object with proper typing
      const workout: Omit<Workout, 'id' | 'createdAt'> = {
        name: name.trim(),
        exercises: exercises.map(exercise => ({
          ...exercise,
          id: generateId(),
          name: exercise.name.trim(),
          sets: Math.max(1, exercise.sets),
          reps: Math.max(1, exercise.reps),
          weight: Math.max(0, exercise.weight),
          restTime: Math.max(0, exercise.restTime),
        })),
        duration,
        calories,
      };
      
      // Add to state
      const id = addWorkout(workout);
      
      // Navigate to the workout detail page
      navigate(`/workouts/${id}`);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Apply an AI recommendation
  const applyRecommendation = (exercise: { name: string; category: string }) => {
    const emptyExerciseIndex = exercises.findIndex(e => !e.name);
    
    if (emptyExerciseIndex >= 0) {
      updateExercise(emptyExerciseIndex, 'name', exercise.name);
      updateExercise(emptyExerciseIndex, 'category', exercise.category as any);
    } else {
      setExercises([...exercises, {
        name: exercise.name,
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: userProfile.preferences.defaultRestTime,
        category: exercise.category as any,
      }]);
    }
    
    setShowRecommendations(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => navigate('/workouts')}
        icon={<ArrowLeft size={16} />}
      >
        Retour
      </Button>
      
      <h1 className="text-2xl font-bold mb-4">Créer un Entraînement</h1>
      
      <div className="space-y-6">
        {/* Workout name */}
        <div>
          <label htmlFor="workout-name" className="block text-sm font-medium text-text-secondary mb-1">
            Nom de l'entraînement
          </label>
          <input
            id="workout-name"
            type="text"
            className="input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mon Super Entraînement"
          />
        </div>
        
        {/* AI Recommendations */}
        {userProfile.preferences.aiRecommendations && (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mb-3 border-primary/30 text-primary w-full"
              icon={<Brain size={16} />}
              onClick={() => setShowRecommendations(!showRecommendations)}
            >
              {showRecommendations ? 'Masquer les recommandations' : 'Obtenir des recommandations IA'}
            </Button>
            
            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="bg-surface mb-4">
                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-2">
                        Recommandé pour votre objectif {userProfile.goal.replace('_', ' ')} :
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {exerciseRecommendations.slice(0, 6).map((exercise, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            className="justify-start border border-surface-light"
                            onClick={() => applyRecommendation(exercise)}
                          >
                            {exercise.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Exercises */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Exercices</h2>
            <span className="text-sm text-text-secondary">
              {exercises.length} exercice{exercises.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <AnimatePresence initial={false}>
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="input w-full"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          placeholder="Nom de l'exercice"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-error hover:bg-error/10"
                        icon={<Trash2 size={16} />}
                        onClick={() => removeExercise(index)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Catégorie
                        </label>
                        <select
                          className="input w-full"
                          value={exercise.category}
                          onChange={(e) => updateExercise(index, 'category', e.target.value)}
                        >
                          <option value="strength">Force</option>
                          <option value="cardio">Cardio</option>
                          <option value="flexibility">Flexibilité</option>
                          <option value="balance">Équilibre</option>
                          <option value="recovery">Récupération</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Temps de repos (sec)
                        </label>
                        <input
                          type="number"
                          className="input w-full"
                          value={exercise.restTime}
                          onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value))}
                          min="0"
                          step="5"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Séries
                        </label>
                        <input
                          type="number"
                          className="input w-full"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Répétitions
                        </label>
                        <input
                          type="number"
                          className="input w-full"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Poids ({userProfile.preferences.weightUnit})
                        </label>
                        <input
                          type="number"
                          className="input w-full"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <Badge
                        variant={
                          exercise.category === 'strength' ? 'primary' :
                          exercise.category === 'cardio' ? 'secondary' :
                          exercise.category === 'flexibility' ? 'success' :
                          'default'
                        }
                        size="sm"
                      >
                        {exercise.category}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<ChevronUp size={14} />}
                            onClick={() => {
                              const newExercises = [...exercises];
                              [newExercises[index], newExercises[index - 1]] = 
                                [newExercises[index - 1], newExercises[index]];
                              setExercises(newExercises);
                            }}
                          />
                        )}
                        
                        {index < exercises.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<ChevronDown size={14} />}
                            onClick={() => {
                              const newExercises = [...exercises];
                              [newExercises[index], newExercises[index + 1]] = 
                                [newExercises[index + 1], newExercises[index]];
                              setExercises(newExercises);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Button
            variant="outline"
            fullWidth
            icon={<Plus size={18} />}
            onClick={addExercise}
          >
            Ajouter un exercice
          </Button>
        </div>
        
        {/* Summary */}
        <Card className="bg-surface">
          <div className="p-4">
            <h3 className="font-medium mb-2">Résumé de l'entraînement</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-text-secondary">Durée estimée :</span>
                <p className="font-medium">{Math.round(calculateDuration())} minutes</p>
              </div>
              <div>
                <span className="text-text-secondary">Calories estimées :</span>
                <p className="font-medium">{calculateCalories(calculateDuration())} kcal</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Save button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={<Save size={18} />}
          onClick={handleSave}
          disabled={isSubmitting || !name.trim() || exercises.length === 0 || exercises.some(e => !e.name.trim())}
        >
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder l\'entraînement'}
        </Button>
      </div>
    </div>
  );
}