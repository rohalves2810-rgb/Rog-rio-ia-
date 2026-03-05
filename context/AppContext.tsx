import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, WorkoutPlan, ChatMessage } from '../types';
import { authService } from '../services/mockBackend.ts';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  completeWorkout: (focus: string, duration: string) => void;
  logout: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (user: UserProfile) => Promise<UserProfile>;
  saveGeneratedPlan: (plan: WorkoutPlan, explicitUser?: UserProfile) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading to check session

  // Check for active session on load
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const data = await authService.checkSession();
            if (data) {
                setUser(data.user);
                setWorkoutPlan(data.plan);
            }
        } catch (e) {
            console.error("Session check failed", e);
        } finally {
            setIsLoading(false);
        }
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
      setIsLoading(true);
      try {
          const data = await authService.login(email, pass);
          setUser(data.user);
          setWorkoutPlan(data.plan);
      } catch (e) {
          throw e;
      } finally {
          setIsLoading(false);
      }
  };

  const register = async (newUser: UserProfile): Promise<UserProfile> => {
      setIsLoading(true);
      try {
          const registeredUser = await authService.register(newUser);
          setUser(registeredUser);
          return registeredUser;
      } catch (e) {
          throw e;
      } finally {
          setIsLoading(false);
      }
  };

  const saveGeneratedPlan = async (plan: WorkoutPlan, explicitUser?: UserProfile) => {
      const targetUser = explicitUser || user;
      if (targetUser) {
          await authService.savePlan(targetUser.id, plan);
          setWorkoutPlan(plan);
      } else {
          console.error("Cannot save plan: No user identified");
      }
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const completeWorkout = (focus: string, duration: string) => {
    if (user) {
        const today = new Date().toISOString().split('T')[0];
        
        const newEntry = {
            date: today,
            focus: focus,
            duration: duration
        };

        const updatedUser = {
            ...user,
            completedWorkouts: [...(user.completedWorkouts || []), newEntry]
        };
        setUser(updatedUser);
        // Sync with backend
        authService.updateUser(updatedUser);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setWorkoutPlan(null);
    setChatHistory([]);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      workoutPlan,
      setWorkoutPlan,
      chatHistory,
      addChatMessage,
      isLoading,
      setIsLoading,
      completeWorkout,
      logout,
      login,
      register,
      saveGeneratedPlan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
