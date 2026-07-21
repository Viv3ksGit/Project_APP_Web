import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const NAME_KEY = "msr_profile_name_v1";

export async function getStoredName(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(NAME_KEY)) ?? "";
  } catch {
    return "";
  }
}

export async function setStoredName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(NAME_KEY, name.trim());
  } catch {
    // ignore write failures (e.g. storage unavailable)
  }
}

/**
 * Returns the saved name (empty string until loaded / if unset) and a setter
 * that persists. Re-reads on each focus via the `refresh` callback.
 */
export function useProfileName() {
  const [name, setName] = useState("");

  const refresh = useCallback(() => {
    getStoredName().then(setName);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (next: string) => {
    await setStoredName(next);
    setName(next.trim());
  }, []);

  return { name, save, refresh };
}
