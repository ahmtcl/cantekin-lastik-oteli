import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Settings } from "@/lib/types";

const COLLECTION_NAME = "settings";
const SETTINGS_DOC_ID = "general";

const defaultSettings: Settings = {
  workingDays: [1, 2, 3, 4, 5],
  workingHours: {
    start: "09:00",
    end: "18:00",
  },
  appointmentInterval: 30,
  closedDays: [],
};

export const getSettings = async (): Promise<Settings> => {
  // Return default settings if Firebase is not initialized (SSR or missing config)
  if (!db) {
    console.warn("Firebase not initialized, returning default settings");
    return defaultSettings;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Settings;
    }

    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return defaultSettings;
  }
};

export const updateSettings = async (settings: Partial<Settings>): Promise<void> => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
  const currentSettings = await getSettings();

  await setDoc(docRef, {
    ...currentSettings,
    ...settings,
  });
};
