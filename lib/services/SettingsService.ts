import AsyncStorage from "@react-native-async-storage/async-storage";

export type Settings = {
  resetCounter: boolean;
  vibrateOnEach: boolean;
  longVibrateOnLap: boolean;
  volumeButtonSwipes: boolean;
  stopwatch: boolean;
};

const STORAGE_KEY = "settings";

export const defaultSettings: Settings = {
  resetCounter: false,
  vibrateOnEach: false,
  longVibrateOnLap: false,
  volumeButtonSwipes: false,
  stopwatch: false,
};

export class SettingsService {
  static defaultSettings = defaultSettings;
  // Load settings from storage
  static async load(): Promise<Settings> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Settings;
    } catch (err) {
      console.log("Failed to load settings:", err);
    }
    return { ...defaultSettings };
  }

  // Save settings to storage
  static async save(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.log("Failed to save settings:", err);
    }
  }

  // Update a single key
  static async update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): Promise<void> {
    const settings = await this.load();
    const updated = { ...settings, [key]: value };
    await this.save(updated);
  }
}
