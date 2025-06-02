export const translations = {
  fr: {
    common: {
      save: 'Sauvegarder',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      finish: 'Terminer',
      loading: 'Chargement...',
    },
    workout: {
      create: 'Créer un entraînement',
      start: 'Commencer',
      schedule: 'Planifier',
      complete: 'Terminer',
      exercises: 'Exercices',
      sets: 'Séries',
      reps: 'Répétitions',
      weight: 'Poids',
      rest: 'Repos',
    },
    calendar: {
      title: 'Calendrier',
      addWorkout: 'Ajouter un entraînement',
      noEvents: 'Aucun événement prévu',
      schedule: 'Planifier',
    },
    settings: {
      title: 'Paramètres',
      language: 'Langue',
      theme: 'Thème',
      notifications: 'Notifications',
      units: 'Unités',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      loading: 'Loading...',
    },
    workout: {
      create: 'Create Workout',
      start: 'Start',
      schedule: 'Schedule',
      complete: 'Complete',
      exercises: 'Exercises',
      sets: 'Sets',
      reps: 'Reps',
      weight: 'Weight',
      rest: 'Rest',
    },
    calendar: {
      title: 'Calendar',
      addWorkout: 'Add Workout',
      noEvents: 'No events scheduled',
      schedule: 'Schedule',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      units: 'Units',
    },
  },
};

export const useTranslation = (language: string) => {
  return (key: string) => {
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      if (!translation[k]) return key;
      translation = translation[k];
    }
    
    return translation;
  };
};