import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "currentUserPhone";

let currentUserPhone: string | null = null;

export const setCurrentUserPhone = (phone: string): void => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone) return;

  currentUserPhone = cleanPhone;

  AsyncStorage.setItem(SESSION_KEY, cleanPhone)
    .then(() => console.log("SESSION SAVED:", cleanPhone))
    .catch((error) => console.error("SESSION SAVE ERROR:", error));
};

export const getCurrentUserPhone = async (): Promise<string | null> => {
  if (currentUserPhone) {
    return currentUserPhone;
  }

  try {
    const savedPhone = await AsyncStorage.getItem(SESSION_KEY);

    if (savedPhone) {
      currentUserPhone = savedPhone;
      console.log("SESSION RESTORED:", savedPhone);
      return savedPhone;
    }
  } catch (error) {
    console.error("SESSION READ ERROR:", error);
  }

  return null;
};

export const clearCurrentUserPhone = (): void => {
  currentUserPhone = null;

  AsyncStorage.removeItem(SESSION_KEY)
    .then(() => console.log("SESSION CLEARED"))
    .catch((error) => console.error("SESSION CLEAR ERROR:", error));
};
