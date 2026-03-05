import { UserProfile } from "../types";

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações.");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendWorkoutReminder = (user: UserProfile) => {
  if (Notification.permission !== "granted") return;

  const messages = [
    `Ei, ${user.name}! Hora de conquistar seus objetivos. Seu treino de hoje está esperando!`,
    `Não se esqueça do seu treino, ${user.name}! Mantenha a constância.`,
    `Vamos lá, ${user.name}? Foco no objetivo: ${user.goal}!`,
    `Tudo pronto para o treino? Sua evolução depende da sua disciplina, ${user.name}.`
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const notification = new Notification("Evolução Fit AI", {
    body: randomMessage,
    icon: "https://cdn-icons-png.flaticon.com/512/2964/2964514.png", // Placeholder fitness icon
    tag: "workout-reminder", // Prevents stacking too many notifications
    requireInteraction: true
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

export const scheduleReminder = (user: UserProfile, delayMs: number = 10000) => {
    setTimeout(() => {
        sendWorkoutReminder(user);
    }, delayMs);
};