import React from 'react';
import { TrainerWorkoutLibrary } from '../components/TrainerWorkoutLibrary';
import { useAuth } from '../hooks/useAuth';

export const Biblioteca: React.FC = () => {
  const { profile } = useAuth();
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <TrainerWorkoutLibrary trainerId={profile?.uid || ''} />
    </div>
  );
};
