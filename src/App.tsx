import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Import layout
import Layout from './components/layout/Layout';

// Import pages
import Home from './pages/Home';
import WorkoutList from './pages/workout/WorkoutList';
import WorkoutCreate from './pages/workout/WorkoutCreate';
import WorkoutDetail from './pages/workout/WorkoutDetail';
import WorkoutStart from './pages/workout/WorkoutStart';
import WorkoutComplete from './pages/workout/WorkoutComplete';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';
import TimerPage from './pages/TimerPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/workouts" element={<Layout><WorkoutList /></Layout>} />
          <Route path="/workouts/create" element={<Layout><WorkoutCreate /></Layout>} />
          <Route path="/workouts/:id" element={<Layout><WorkoutDetail /></Layout>} />
          <Route path="/workouts/:id/start" element={<Layout><WorkoutStart /></Layout>} />
          <Route path="/workouts/:id/complete" element={<Layout><WorkoutComplete /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/stats" element={<Layout><Stats /></Layout>} />
          <Route path="/ai" element={<Layout><AICoach /></Layout>} />
          <Route path="/timer" element={<Layout><TimerPage /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;