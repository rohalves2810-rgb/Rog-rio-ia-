import { UserProfile, WorkoutPlan } from '../types';

// Keys for LocalStorage
const DB_USERS_KEY = 'evofit_db_users';
const DB_PLANS_KEY = 'evofit_db_plans';
const SESSION_KEY = 'evofit_session_user_id';

// Helper to get DB
const getDB = () => {
    const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '{}');
    const plans = JSON.parse(localStorage.getItem(DB_PLANS_KEY) || '{}');
    return { users, plans };
};

// Helper to save DB
const saveDB = (users: any, plans: any) => {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(DB_PLANS_KEY, JSON.stringify(plans));
};

export const authService = {
    // Register a new user
    register: async (user: UserProfile): Promise<UserProfile> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const { users, plans } = getDB();
                
                // Check if email exists
                const emailExists = Object.values(users).some((u: any) => u.email === user.email);
                if (emailExists) {
                    reject(new Error("Este email já está cadastrado."));
                    return;
                }

                // Create User
                const newUser = { ...user, id: crypto.randomUUID() };
                users[newUser.id] = newUser;
                saveDB(users, plans);
                
                // Set Session
                localStorage.setItem(SESSION_KEY, newUser.id);
                resolve(newUser);
            }, 800); // Simulate network delay
        });
    },

    // Login
    login: async (email: string, password: string): Promise<{ user: UserProfile, plan: WorkoutPlan | null }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const { users, plans } = getDB();
                
                const user = Object.values(users).find((u: any) => u.email === email && u.password === password) as UserProfile | undefined;
                
                if (!user) {
                    reject(new Error("Email ou senha inválidos."));
                    return;
                }

                // Set Session
                localStorage.setItem(SESSION_KEY, user.id);
                
                // Get Plan
                const plan = plans[user.id] || null;

                resolve({ user, plan });
            }, 800);
        });
    },

    // Logout
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // Check Session (Auto-login)
    checkSession: async (): Promise<{ user: UserProfile, plan: WorkoutPlan | null } | null> => {
        const userId = localStorage.getItem(SESSION_KEY);
        if (!userId) return null;

        const { users, plans } = getDB();
        const user = users[userId];
        const plan = plans[userId];

        if (user) {
            return { user, plan };
        }
        return null;
    },

    // Save Workout Plan
    savePlan: async (userId: string, plan: WorkoutPlan) => {
        const { users, plans } = getDB();
        plans[userId] = plan;
        saveDB(users, plans);
    },

    // Update User (e.g. completed workouts)
    updateUser: async (user: UserProfile) => {
        const { users, plans } = getDB();
        if (users[user.id]) {
            users[user.id] = user;
            saveDB(users, plans);
        }
    }
};
