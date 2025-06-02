import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Calendar, Clock, Flame, Dumbbell, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/stats/StatsCard';
import { Button } from '../components/ui/Button';
import { formatDuration, formatDate } from '../lib/utils';

export default function Stats() {
  const { userProfile, workouts, sessions } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Get the stats from user profile
  const { stats } = userProfile;
  
  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', workouts: 1, calories: 320, duration: 45 },
    { name: 'Tue', workouts: 0, calories: 0, duration: 0 },
    { name: 'Wed', workouts: 1, calories: 280, duration: 30 },
    { name: 'Thu', workouts: 0, calories: 0, duration: 0 },
    { name: 'Fri', workouts: 1, calories: 350, duration: 50 },
    { name: 'Sat', workouts: 0, calories: 0, duration: 0 },
    { name: 'Sun', workouts: 1, calories: 200, duration: 25 }
  ];
  
  const monthlyData = weeklyData.concat(weeklyData.slice(0, 3)).map((item, i) => ({
    ...item,
    name: `Week ${Math.floor(i / 7) + 1}, ${item.name}`
  }));
  
  const yearlyData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
    workouts: Math.floor(Math.random() * 12) + 5,
    calories: Math.floor(Math.random() * 5000) + 1000,
    duration: Math.floor(Math.random() * 500) + 100
  }));
  
  // Get the appropriate data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case 'week': return weeklyData;
      case 'month': return monthlyData;
      case 'year': return yearlyData;
      default: return weeklyData;
    }
  };
  
  const chartData = getChartData();
  
  // Workout distribution by type (mock data)
  const workoutTypeData = [
    { name: 'Strength', value: 60, color: '#a855f7' },
    { name: 'Cardio', value: 25, color: '#ec4899' },
    { name: 'Flexibility', value: 10, color: '#22c55e' },
    { name: 'Other', value: 5, color: '#8b5cf6' },
  ];
  
  // Progress over time (mock data)
  const progressData = Array.from({ length: 10 }, (_, i) => ({
    week: `W${i + 1}`,
    weight: 50 + Math.random() * 20,
    reps: 8 + Math.floor(Math.random() * 5),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Stats</h1>
      
      {/* Main stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Workouts Completed"
          value={stats.workoutsCompleted}
          icon={<Activity size={24} />}
          change={15}
          changeText="vs last month"
        />
        <StatsCard
          title="Total Duration"
          value={formatDuration(stats.totalWorkoutDuration)}
          icon={<Clock size={24} />}
          change={8}
          changeText="vs last month"
        />
        <StatsCard
          title="Calories Burned"
          value={stats.totalCaloriesBurned}
          icon={<Flame size={24} />}
          change={12}
          changeText="vs last month"
        />
        <StatsCard
          title="Weight Lifted"
          value={`${stats.totalWeightLifted} ${userProfile.preferences.weightUnit}`}
          icon={<Dumbbell size={24} />}
          change={20}
          changeText="vs last month"
        />
      </div>
      
      {/* Time range selector */}
      <div className="flex justify-center space-x-2 mb-4">
        {(['week', 'month', 'year'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>
      
      {/* Activity chart */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: 'white' }}
                />
                <Bar dataKey="calories" name="Calories" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      
      {/* Workout distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Workout Type Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
        
        {/* Progress over time */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Strength Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="week" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#a855f7"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="reps"
                    name="Reps"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Streak and achievements */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Current Streak</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold">{stats.streakDays}</span>
            </div>
            <div>
              <p className="font-medium">
                {stats.streakDays} day{stats.streakDays !== 1 ? 's' : ''} streak
              </p>
              <p className="text-sm text-text-secondary">
                Keep going to maintain your progress!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}