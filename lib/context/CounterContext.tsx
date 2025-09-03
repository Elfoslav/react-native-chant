import { createContext, useContext, useEffect, useState } from "react";
import {
	Counter,
	CounterService,
	defaultCounter,
} from "../services/CounterService";

type CounterContextType = {
	counter: Counter;
	setCounter: React.Dispatch<React.SetStateAction<Counter>>;
	resetCounter: () => Promise<void>;
	updateCounter: <K extends keyof Counter>(
		key: K,
		value: Counter[K]
	) => Promise<void>;
	updateCounterMultiple: (updates: Partial<Counter>) => Promise<void>;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
	const [counter, setCounter] = useState<Counter>(defaultCounter);

	useEffect(() => {
		(async () => {
			const loaded = await CounterService.get();
			setCounter(loaded);
		})();
	}, []);

	const updateCounter = async <K extends keyof Counter>(
		key: K,
		value: Counter[K]
	) => {
		setCounter((prev) => {
			const newCounter = { ...prev, [key]: value };
			CounterService.update(key, value); // no stale state
			return newCounter;
		});
	};

	const updateCounterMultiple = async (updates: Partial<Counter>) => {
		setCounter((prev) => {
			const newCounter = { ...prev, ...updates };
			CounterService.updateMultiple(newCounter);
			return newCounter;
		});
	};

	const resetCounter = async () => {
		setCounter(CounterService.defaultCounter);
		return await CounterService.save(CounterService.defaultCounter);
	};

	return (
		<CounterContext.Provider
			value={{
				counter,
				setCounter,
				resetCounter,
				updateCounter,
				updateCounterMultiple,
			}}
		>
			{children}
		</CounterContext.Provider>
	);
}

export function useCounter() {
	const ctx = useContext(CounterContext);
	if (!ctx) throw new Error("useCounter must be used inside CounterProvider");
	return ctx;
}
