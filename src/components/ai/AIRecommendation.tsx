import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, Dumbbell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { AiRecommendation } from '../../types';

interface AIRecommendationProps {
  recommendation: AiRecommendation;
  onAccept?: () => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationProps> = ({
  recommendation,
  onAccept,
}) => {
  const { type, title, description } = recommendation;
  
  // Define icon based on recommendation type
  const getIcon = () => {
    switch (type) {
      case 'exercise':
        return <Dumbbell className="text-secondary" />;
      case 'workout':
        return <Dumbbell className="text-primary" />;
      case 'rest':
        return <Lightbulb className="text-warning" />;
      case 'progression':
        return <TrendingUp className="text-success" />;
      default:
        return <Brain className="text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-l-4 border-l-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <Brain className="w-full h-full" />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-text-secondary">{description}</p>
        </CardContent>
        
        {onAccept && (
          <CardFooter>
            <Button 
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={onAccept}
            >
              Apply Recommendation
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export const AIRecommendationList: React.FC<{
  recommendations: AiRecommendation[];
  onAccept?: (recommendation: AiRecommendation) => void;
}> = ({ recommendations, onAccept }) => {
  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <AIRecommendationCard
          key={index}
          recommendation={rec}
          onAccept={onAccept ? () => onAccept(rec) : undefined}
        />
      ))}
      
      {recommendations.length === 0 && (
        <div className="text-center py-6 text-text-secondary">
          <Brain className="mx-auto mb-3 text-text-secondary opacity-50" />
          <p>No recommendations available yet.</p>
          <p className="text-sm mt-1">Keep using the app to get personalized advice.</p>
        </div>
      )}
    </div>
  );
};