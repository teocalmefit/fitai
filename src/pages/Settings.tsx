import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Brain, Weight, User, Goal, Save, Dumbbell, Activity, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { UserGoal } from '../types';
import { cn } from '../lib/utils';

export default function Settings() {
  const { userProfile, updateProfile, updatePreferences, updateGoal } = useApp();
  const { preferences, goal } = userProfile;
  
  const [username, setUsername] = useState(userProfile.name);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Reset form when profile changes
  useEffect(() => {
    setUsername(userProfile.name);
  }, [userProfile.name]);

  // Track changes
  useEffect(() => {
    const isChanged = username !== userProfile.name;
    setIsDirty(isChanged);
  }, [username, userProfile.name]);
  
  // Define available goals
  const availableGoals: { value: UserGoal; label: string; icon: React.ReactNode }[] = [
    { value: 'muscle_gain', label: 'Prise de Masse', icon: <Dumbbell size={16} /> },
    { value: 'weight_loss', label: 'Perte de Poids', icon: <Weight size={16} /> },
    { value: 'endurance', label: 'Endurance', icon: <Activity size={16} /> },
    { value: 'strength', label: 'Force', icon: <Award size={16} /> },
    { value: 'flexibility', label: 'Flexibilité', icon: <User size={16} /> },
    { value: 'maintenance', label: 'Maintien', icon: <Goal size={16} /> },
  ];
  
  // Toggle a boolean preference with debounce
  const togglePreference = (key: keyof typeof preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setIsSaving(true);
      updatePreferences({ [key]: !preferences[key] });
      
      // Show success feedback
      setShowSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSaveSuccess(false);
      }, 1000);
    }
  };
  
  // Update username with validation
  const handleUpdateUsername = async () => {
    if (username.trim() && username !== userProfile.name) {
      setIsSaving(true);
      await updateProfile({ name: username.trim() });
      setIsDirty(false);
      
      // Show success feedback
      setShowSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSaveSuccess(false);
      }, 1000);
    }
  };

  // Handle goal selection with animation
  const handleGoalSelect = async (newGoal: UserGoal) => {
    if (newGoal !== goal) {
      setIsSaving(true);
      await updateGoal(newGoal);
      
      // Show success feedback
      setShowSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSaveSuccess(false);
      }, 1000);
    }
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
        >
          <SettingsIcon className="text-white" size={24} />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-text-secondary">
            Personnalisez votre expérience FitAI
          </p>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Profile settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Votre Nom
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={cn(
                      "input flex-1",
                      isDirty && "border-primary"
                    )}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom"
                    maxLength={30}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleUpdateUsername}
                    disabled={!isDirty || isSaving}
                    icon={isSaving ? undefined : <Save size={16} />}
                  >
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Unité de Poids
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={preferences.weightUnit === 'kg' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ weightUnit: 'kg' })}
                    className="flex-1"
                  >
                    Kilogrammes (kg)
                  </Button>
                  <Button
                    variant={preferences.weightUnit === 'lbs' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ weightUnit: 'lbs' })}
                    className="flex-1"
                  >
                    Livres (lbs)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Fitness goals */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Goal size={18} />
                Objectifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-text-secondary mb-2">
                  Sélectionnez votre objectif principal
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableGoals.map(({ value, label, icon }) => (
                    <Button
                      key={value}
                      variant={goal === value ? 'primary' : 'outline'}
                      className={cn(
                        "justify-start",
                        goal === value && "relative overflow-hidden"
                      )}
                      icon={icon}
                      onClick={() => handleGoalSelect(value)}
                    >
                      {label}
                      {goal === value && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* App settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon size={18} />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.darkMode ? (
                    <Moon size={18} className="text-primary" />
                  ) : (
                    <Sun size={18} className="text-warning" />
                  )}
                  <span>Thème Sombre</span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onChange={() => togglePreference('darkMode')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="dark-mode"
                    className={cn(
                      "block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer",
                      preferences.darkMode ? "bg-primary" : "bg-surface-light"
                    )}
                  >
                    <motion.span
                      className="block w-4 h-4 mt-1 ml-1 rounded-full bg-white"
                      animate={{ 
                        translateX: preferences.darkMode ? 24 : 0 
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.notificationsEnabled ? (
                    <Bell size={18} className="text-primary" />
                  ) : (
                    <BellOff size={18} className="text-text-secondary" />
                  )}
                  <span>Notifications</span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={preferences.notificationsEnabled}
                    onChange={() => togglePreference('notificationsEnabled')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="notifications"
                    className={cn(
                      "block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer",
                      preferences.notificationsEnabled ? "bg-primary" : "bg-surface-light"
                    )}
                  >
                    <motion.span
                      className="block w-4 h-4 mt-1 ml-1 rounded-full bg-white"
                      animate={{ 
                        translateX: preferences.notificationsEnabled ? 24 : 0 
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={18} className={preferences.aiRecommendations ? "text-primary" : "text-text-secondary"} />
                  <span>Recommandations IA</span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="ai-recommendations"
                    checked={preferences.aiRecommendations}
                    onChange={() => togglePreference('aiRecommendations')}
                    className="sr-only"
                  />
                  <label
                    htmlFor="ai-recommendations"
                    className={cn(
                      "block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer",
                      preferences.aiRecommendations ? "bg-primary" : "bg-surface-light"
                    )}
                  >
                    <motion.span
                      className="block w-4 h-4 mt-1 ml-1 rounded-full bg-white"
                      animate={{ 
                        translateX: preferences.aiRecommendations ? 24 : 0 
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Temps de Repos par Défaut
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={preferences.defaultRestTime}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      updatePreferences({ defaultRestTime: value });
                    }}
                    className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-16 text-center">{preferences.defaultRestTime}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* App info */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">FitAI</h3>
                  <p className="text-sm text-text-secondary">Version 1.0.0</p>
                </div>
                <Badge variant="primary">Beta</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Success notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showSaveSuccess ? 1 : 0,
          y: showSaveSuccess ? 0 : 20
        }}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
      >
        <div className="bg-success/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            ✓
          </motion.div>
          Paramètres sauvegardés
        </div>
      </motion.div>
    </div>
  );
}