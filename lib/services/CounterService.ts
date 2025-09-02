import AsyncStorage from "@react-native-async-storage/async-storage";

// round: number of round, time: in seconds
export type Round = { round: number; time: number };

export type Counter = {
  count: number;
  rounds: number;
  roundTime: number; // seconds
  roundsList: Round[];
};

const STORAGE_KEY = "counter";

export const defaultCounter: Counter = {
  count: 0,
  rounds: 0,
  roundTime: 0,
  roundsList: [],
};

export class CounterService {
  static defaultCounter = defaultCounter;
  static async get(): Promise<Counter> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Counter;
    } catch (err) {
      console.log("Failed to load counter data:", err);
    }
    return { ...defaultCounter };
  }

  // Save counter data to storage
  static async save(counterData: Counter): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counterData));
    } catch (err) {
      console.log("Failed to save counter data:", err);
    }
  }

  // Update a single key
  static async update<K extends keyof Counter>(
    key: K,
    value: Counter[K]
  ): Promise<void> {
    const counter = await this.get();
    const updated = { ...counter, [key]: value };
    await this.save(updated);
  }

  static async updateMultiple(updates: Partial<Counter>): Promise<void> {
    const counter = await this.get();
    const updated = { ...counter, ...updates };
    await this.save(updated);
  }
}
