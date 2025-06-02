import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIRecommendationList } from '../components/ai/AIRecommendation';
import { useApp } from '../context/AppContext';
import { mockAiService } from '../services/mockAiService';
import { AiRecommendation } from '../types';

export default function AICoach() {
  const { userProfile, workouts, sessions, updateWorkout } = useApp();
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get AI recommendations on component mount
  useEffect(() => {
    if (userProfile.preferences.aiRecommendations) {
      // Simulate API call
      setTimeout(() => {
        const recs = mockAiService.getWorkoutRecommendations(
          userProfile.goal,
          sessions,
          workouts
        );
        setRecommendations(recs);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [userProfile.goal, userProfile.preferences.aiRecommendations, sessions, workouts]);
  
  // Handle accepting a recommendation
  const handleAcceptRecommendation = (recommendation: AiRecommendation) => {
    // This would normally apply the recommendation in some way
    // For now, we'll just remove it from the list
    setRecommendations(recommendations.filter(r => r !== recommendation));
  };
  
  // Example questions to ask AI
  const exampleQuestions = [
    "How do I increase my bench press?",
    "What's the best time to work out?",
    "Should I do cardio before or after weights?",
    "How many rest days should I take?",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Brain className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Coach</h1>
          <p className="text-text-secondary">
            Personalized recommendations for your fitness journey
          </p>
        </div>
      </div>
      
      {/* Recommendations section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-secondary" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3">
                <svg className="animate-spin w-full h-full text-primary\" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-text-secondary">Generating personalized recommendations...</p>
            </div>
          ) : (
            <AIRecommendationList 
              recommendations={recommendations} 
              onAccept={handleAcceptRecommendation} 
            />
          )}
          
          {!loading && recommendations.length === 0 && (
            <div className="text-center py-6 text-text-secondary">
              <Brain className="mx-auto mb-3 opacity-50\" size={24} />
              <p>No recommendations right now</p>
              <p className="text-sm mt-1">Complete more workouts to get personalized advice</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* AI Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Ask the AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-text-secondary mb-3">
            What would you like to know about your training?
          </div>
          
          {/* Mock chat interface */}
          <div className="mb-4">
            {exampleQuestions.map((question, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 p-2 hover:bg-surface rounded-lg cursor-pointer mb-1"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ChevronRight size={16} className="text-primary" />
                <span>{question}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Type your fitness question..."
              className="input w-full"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Brain size={20} className="text-primary" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}