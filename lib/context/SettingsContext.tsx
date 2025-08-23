import { createContext, useContext, useEffect, useState } from "react";
import {
	Settings,
	SettingsService,
	defaultSettings,
} from "../services/SettingsService";

type SettingsContextType = {
	settings: Settings;
	updateSetting: <K extends keyof Settings>(
		key: K,
		value: Settings[K]
	) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

	useEffect(() => {
		(async () => {
			const loaded = await SettingsService.load();
			setSettings(loaded);
		})();
	}, []);

	const updateSetting = async <K extends keyof Settings>(
		key: K,
		value: Settings[K]
	) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
		await SettingsService.update(key, value);
	};

	return (
		<SettingsContext.Provider value={{ settings, updateSetting }}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
	return ctx;
}
