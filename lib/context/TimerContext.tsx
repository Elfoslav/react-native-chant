// lib/context/TimerContext.tsx
import React, { createContext, useContext, useState, useRef } from "react";
import { Vibration } from "react-native";
import { Round } from "../services/CounterService";
import { useCounter } from "./CounterContext";
import { useSettings } from "./SettingsContext";

interface TimerContextType {
	count: number;
	showRounds: boolean;
	isRunning: boolean;
	rounds: number;
	time: number;
	roundsList: Round[];
	toggleShowRounds: () => void;
	startTimer: () => void;
	pauseTimer: () => void;
	stopTimer: () => void;
	handleChant: () => void;
	formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		counter: counterData,
		setCounter,
		updateCounter,
		updateCounterMultiple,
	} = useCounter();
	const { count, rounds, roundTime, roundsList } = counterData;
	const { settings } = useSettings();

	const [showRounds, setShowRounds] = useState(true);
	const [isRunning, setIsRunning] = useState(false);

	const intervalRef = useRef<number | null>(null);
	const lastTapRef = useRef(0);

	const startTimer = () => {
		if (intervalRef.current) return;

		intervalRef.current = setInterval(() => {
			setCounter((prev) => {
				const newRoundTime = prev.roundTime + 1;

				// Update in-memory state
				const updated = { ...prev, roundTime: newRoundTime };

				// Persist every tick
				updateCounter("roundTime", newRoundTime);

				return updated;
			});
		}, 1000);

		setIsRunning(true);
	};

	const pauseTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			setIsRunning(false);
		}
	};

	const stopTimer = () => {
		pauseTimer();
	};

	const handleChant = () => {
		const now = Date.now();
		if (now - lastTapRef.current <= 1000) return; // debounce
		lastTapRef.current = now;

		startTimer();

		if (count === settings.roundsCount) {
			const newRound = rounds + 1;
			updateCounterMultiple({
				count: 0,
				rounds: newRound,
				roundTime: 0, // reset round time
				roundsList: [
					...roundsList,
					{
						round: newRound,
						time: roundTime,
					},
				],
			});

			stopTimer();
			startTimer();

			if (settings.longVibrateOnLap) Vibration.vibrate(700);
		} else {
			updateCounter("count", counterData.count + 1);
			if (settings.vibrateOnEach) Vibration.vibrate(250);
		}
	};

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const toggleShowRounds = () => setShowRounds((prev) => !prev);

	return (
		<TimerContext.Provider
			value={{
				count,
				showRounds,
				isRunning,
				rounds,
				time: roundTime,
				roundsList,
				startTimer,
				pauseTimer,
				stopTimer,
				toggleShowRounds,
				handleChant,
				formatTime,
			}}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimer = () => {
	const context = useContext(TimerContext);
	if (!context)
		throw new Error("useTimerContext must be used within TimerProvider");
	return context;
};
