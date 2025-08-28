// lib/context/TimerContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
} from "react";
import { Vibration, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSettings } from "./SettingsContext";

type Round = { round: number; time: number };

interface TimerContextType {
	counter: number;
	showRounds: boolean;
	isRunning: boolean;
	rounds: number;
	time: number;
	roundsList: Round[];
	toggleShowRounds: () => void;
	startTimer: () => void;
	pauseTimer: () => void;
	stopTimer: () => void;
	handleChantTap: () => void;
	formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { settings } = useSettings(); // global vibration settings
	const [counter, setCounter] = useState(0);
	const [showRounds, setShowRounds] = useState(true);
	const [rounds, setRounds] = useState(0);
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [roundsList, setRoundsList] = useState<Round[]>([]);

	const intervalRef = useRef<number | null>(null);
	const lastTapRef = useRef(0);

	const startTimer = useCallback(() => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(
			() => setTime((prev) => prev + 1),
			1000
		) as unknown as number;
		setIsRunning(true);
	}, []);

	const pauseTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			setIsRunning(false);
		}
	}, []);

	const stopTimer = useCallback(() => {
		pauseTimer();
		setTime(0);
		setIsRunning(false);
	}, [pauseTimer]);

	const handleChantTap = useCallback(() => {
		const now = Date.now();
		if (now - lastTapRef.current <= 1000) return;
		lastTapRef.current = now;

		startTimer();

		if (settings.vibrateOnEach) Haptics.selectionAsync();

		if (counter === 3) {
			setCounter(1);
			setRounds((prev) => prev + 1);
			stopTimer();
			startTimer();

			if (settings.longVibrateOnLap) {
				if (Platform.OS === "android") Vibration.vibrate(500);
				else Vibration.vibrate();
			}

			setRoundsList((prev) => [...prev, { round: prev.length + 1, time }]);
		} else {
			setCounter((prev) => prev + 1);
		}
	}, [counter, startTimer, stopTimer, time, settings]);

	const formatTime = useCallback((seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	}, []);

	const toggleShowRounds = () => {
		setShowRounds((prev) => !prev);
	};

	return (
		<TimerContext.Provider
			value={{
				counter,
				showRounds,
				isRunning,
				rounds,
				time,
				roundsList,
				startTimer,
				pauseTimer,
				stopTimer,
				toggleShowRounds,
				handleChantTap,
				formatTime,
			}}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimerContext = () => {
	const context = useContext(TimerContext);
	if (!context)
		throw new Error("useTimerContext must be used within a TimerProvider");
	return context;
};
