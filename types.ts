
export enum UserGoal {
  WeightLoss = 'Emagrecimento',
  MuscleGain = 'Ganho de massa',
  Definition = 'Definição',
  Conditioning = 'Condicionamento',
}

export enum UserLevel {
  Beginner = 'Iniciante',
  Intermediate = 'Intermediário',
  Advanced = 'Avançado',
}

export enum TrainingLocation {
  Gym = 'Academia',
  Home = 'Casa',
}

export enum Gender {
  Male = 'Masculino',
  Female = 'Feminino',
}

export interface WorkoutHistoryEntry {
  date: string; // ISO Date string (YYYY-MM-DD)
  focus: string;
  duration: string; // e.g., "45 min"
}

export interface UserProfile {
  id: string; // Unique ID for database
  name: string;
  email: string;
  password?: string; // Only for form handling, stripped before saving in a real scenario
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  goal: UserGoal;
  level: UserLevel;
  location: TrainingLocation;
  isPremium: boolean;
  freeQuestionsCount: number;
  joinedDate: string;
  completedWorkouts: WorkoutHistoryEntry[]; // Array of detailed history entries
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  imageKeyword?: string; // Search term for the image
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  time: string;
  description: string;
}

export interface Recipe {
  name: string;
  prepTime: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
  imageKeyword: string;
}

export interface DietPlan {
  dailyCalories: string;
  meals: Meal[];
  shoppingList?: string[]; // Optional for backwards compatibility
  recipes?: Recipe[]; // Optional for backwards compatibility
}

export interface WorkoutPlan {
  weeklySummary: string;
  schedule: DailyWorkout[];
  dietPlan: DietPlan;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
