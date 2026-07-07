import type { CompanionResponse } from "./schema";
import type { FollowupItem } from "@/components/companion/FollowupThread";

export interface SavedSession {
  lastMessage: string;
  language: string;
  response: CompanionResponse;
  followups: FollowupItem[];
}

export interface LocalInsights {
  journey: number;
  complaint: number;
  scheme: number;
  document: number;
  followup: number;
}

const SESSION_KEY = "kadam:lastSession";
const INSIGHTS_KEY = "kadam:insights";

// Helper to check if localStorage is available and working (handles private browsing)
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test_local_storage__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function saveSession(session: SavedSession): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn("Failed to save session to localStorage:", err);
  }
}

export function loadSession(): SavedSession | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("Failed to load session from localStorage:", err);
    return null;
  }
}

export function clearSession(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn("Failed to clear session from localStorage:", err);
  }
}

export function incrementInsight(type: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    const insights: LocalInsights = raw
      ? JSON.parse(raw)
      : { journey: 0, complaint: 0, scheme: 0, document: 0, followup: 0 };

    if (type in insights) {
      insights[type as keyof LocalInsights] += 1;
      localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
    }
  } catch (err) {
    console.warn("Failed to update insights in localStorage:", err);
  }
}

export function getMostCommonType(): { type: string; count: number } | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    if (!raw) return null;
    const insights: LocalInsights = JSON.parse(raw);
    let maxType = "";
    let maxCount = 0;
    for (const [type, count] of Object.entries(insights)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    }
    return maxCount > 0 ? { type: maxType, count: maxCount } : null;
  } catch (err) {
    console.warn("Failed to read insights from localStorage:", err);
    return null;
  }
}

export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(INSIGHTS_KEY);
  } catch (err) {
    console.warn("Failed to clear data from localStorage:", err);
  }
}
