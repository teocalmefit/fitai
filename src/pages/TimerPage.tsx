import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Timer } from '../components/ui/Timer';
import { useApp } from '../context/AppContext';

export default function TimerPage() {
  const { userProfile, updatePreferences } = useApp();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  
  // Preset timers (in seconds)
  const presetTimers = [
    { name: '30 sec', time: 30 },
    { name: '1 min', time: 60 },
    { name: '90 sec', time: 90 },
    { name: '2 min', time: 120 },
    { name: '3 min', time: 180 },
    { name: '5 min', time: 300 },
  ];
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="text-primary" size={24} />
        Rest Timer
      </h1>
      
      <p className="text-text-secondary">
        Use the timer to track your rest periods between sets and exercises.
      </p>
      
      {/* Main timer */}
      <Card className="bg-gradient-to-br from-primary/20 to-secondary/20">
        <CardContent className="py-8">
          <Timer defaultTime={userProfile.preferences.defaultRestTime} />
        </CardContent>
      </Card>
      
      {/* Preset timers */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Preset Timers</h2>
        <div className="grid grid-cols-3 gap-3">
          {presetTimers.map((preset) => (
            <Card key={preset.name}>
              <CardContent className="py-4 text-center">
                <h3 className="font-medium">{preset.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    updatePreferences({ defaultRestTime: preset.time });
                  }}
                >
                  Set as Default
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Timer settings */}
      <Card>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Sound Notifications</span>
              <Button
                variant="ghost"
                size="sm"
                icon={soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                onClick={toggleSound}
              >
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Default Rest Time</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input w-20 text-center"
                  value={userProfile.preferences.defaultRestTime}
                  onChange={(e) => updatePreferences({ 
                    defaultRestTime: parseInt(e.target.value) || 60 
                  })}
                  min="5"
                  max="600"
                  step="5"
                />
                <span className="text-text-secondary">seconds</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Vibration Feedback</span>
              <Button
                variant="ghost"
                size="sm"
              >
                Enabled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}