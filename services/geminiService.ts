import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WorkoutPlan, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// System instruction base for the persona
const PERSONAL_TRAINER_SYSTEM_INSTRUCTION = `
Você é o 'Evolução Fit AI', um Personal Trainer direto e eficiente.

REGRAS DE COMUNICAÇÃO:
- SUAS RESPOSTAS DEVEM SER MUITO CURTAS. Máximo de 2 a 3 frases.
- Vá direto ao ponto.
- Fale como um amigo no WhatsApp.

PERFIL:
- Especialista em emagrecimento e hipertrofia.
- Fornece planos de treino e sugestões alimentares.
`;

export const generateWorkoutPlan = async (user: UserProfile): Promise<WorkoutPlan> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Crie um plano completo para:
    Nome: ${user.name}, ${user.age} anos, ${user.weight}kg, ${user.height}cm.
    Objetivo: ${user.goal}.
    Nível: ${user.level}.
    Local: ${user.location}.

    ESTRUTURA OBRIGATÓRIA DA SEMANA (7 DIAS):
    1. "Segunda-feira": Treino Completo (6-8 exercícios)
    2. "Terça-feira": Treino Completo (6-8 exercícios)
    3. "Quarta-feira": Treino Completo (6-8 exercícios)
    4. "Quinta-feira": Treino Completo (6-8 exercícios) - NÃO PODE SER DESCANSO.
    5. "Sexta-feira": Treino Completo (6-8 exercícios)
    6. "Sábado": Treino Completo (6-8 exercícios)
    7. "Domingo": EXATAMENTE "Descanso" (array de exercícios vazio).

    REGRAS:
    - O campo 'day' deve ser exato (ex: "Segunda-feira").
    - Para cada exercício, gere uma 'imageKeyword' em INGLÊS simples (ex: "bench press", "squat") para buscar imagens.
    - Crie um plano alimentar diário (Sugestão geral saudável).
    - Gere uma lista de compras semanal.
    - Crie 3 receitas simples.
  `;

  const exerciseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      sets: { type: Type.INTEGER },
      reps: { type: Type.STRING },
      notes: { type: Type.STRING },
      imageKeyword: { type: Type.STRING, description: "Termo curto em inglês para buscar imagem" },
    },
    required: ["name", "sets", "reps", "imageKeyword"],
  };

  const daySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING, description: "Nome do dia exato: Segunda-feira, Terça-feira, etc." },
      focus: { type: Type.STRING, description: "Foco do treino ou 'Descanso'" },
      exercises: {
        type: Type.ARRAY,
        items: exerciseSchema,
      },
    },
    required: ["day", "focus", "exercises"],
  };

  const mealSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Ex: Café da Manhã" },
      time: { type: Type.STRING, description: "Ex: 08:00" },
      description: { type: Type.STRING, description: "Sugestão de alimento" },
    },
    required: ["name", "time", "description"],
  };

  const recipeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      prepTime: { type: Type.STRING },
      calories: { type: Type.STRING },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
      imageKeyword: { type: Type.STRING, description: "Termo curto em inglês do prato pronto" },
    },
    required: ["name", "prepTime", "calories", "ingredients", "instructions", "imageKeyword"],
  };

  const dietSchema: Schema = {
      type: Type.OBJECT,
      properties: {
          dailyCalories: { type: Type.STRING },
          meals: { type: Type.ARRAY, items: mealSchema },
          shoppingList: { type: Type.ARRAY, items: { type: Type.STRING } },
          recipes: { type: Type.ARRAY, items: recipeSchema }
      },
      required: ["dailyCalories", "meals", "shoppingList", "recipes"]
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      weeklySummary: { type: Type.STRING },
      schedule: {
        type: Type.ARRAY,
        items: daySchema,
      },
      dietPlan: dietSchema
    },
    required: ["weeklySummary", "schedule", "dietPlan"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: PERSONAL_TRAINER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Error generating workout:", error);
    throw error;
  }
};

export const chatWithTrainer = async (
  history: ChatMessage[], 
  newMessage: string, 
  user: UserProfile
): Promise<string> => {
  const modelId = "gemini-3-flash-preview";

  const contextPrompt = `
  Contexto: ${user.name}, ${user.goal}, ${user.level}.
  Responda de forma extremamente breve (max 30 palavras).
  `;

  const chat = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: PERSONAL_TRAINER_SYSTEM_INSTRUCTION + contextPrompt,
    }
  });
  
  for (const msg of history) {
    if (msg.role === 'user') {
      await chat.sendMessage({ message: msg.text });
    } 
  }

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "Não entendi. Pode repetir?";
};