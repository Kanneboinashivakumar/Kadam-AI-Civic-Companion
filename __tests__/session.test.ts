import { expect, test, vi, beforeEach } from "vitest";
import {
  saveSession,
  loadSession,
  clearSession,
  incrementInsight,
  getMostCommonType,
  clearAllData,
} from "@/lib/session";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

test("saveSession and loadSession work correctly", () => {
  const session = {
    lastMessage: "I just had a baby",
    language: "English",
    response: {
      type: "document" as const,
      document_name: "Birth Certificate",
      purpose: "Proof of birth",
      how_to_obtain: "Register",
      typical_cost: "Free",
      typical_time: "7 days",
    },
    followups: [],
  };

  saveSession(session);
  expect(localStorageMock.setItem).toHaveBeenCalledWith("kadam:lastSession", JSON.stringify(session));

  const loaded = loadSession();
  expect(localStorageMock.getItem).toHaveBeenCalledWith("kadam:lastSession");
  expect(loaded).toEqual(session);
});

test("clearSession removes key from storage", () => {
  clearSession();
  expect(localStorageMock.removeItem).toHaveBeenCalledWith("kadam:lastSession");
});

test("incrementInsight keeps correct counters and getMostCommonType returns correct max value", () => {
  incrementInsight("journey");
  incrementInsight("journey");
  incrementInsight("complaint");

  expect(getMostCommonType()).toEqual({ type: "journey", count: 2 });
});

test("clearAllData clears all relevant keys", () => {
  clearAllData();
  expect(localStorageMock.removeItem).toHaveBeenCalledWith("kadam:lastSession");
  expect(localStorageMock.removeItem).toHaveBeenCalledWith("kadam:insights");
});

test("fails gracefully and works fine when localStorage throws/is unavailable", () => {
  // Simulate private browsing mode by causing localStorage to throw on setItem/getItem
  const throwsMock = {
    getItem: vi.fn(() => {
      throw new Error("SecurityError: The operation is insecure.");
    }),
    setItem: vi.fn(() => {
      throw new Error("SecurityError: The operation is insecure.");
    }),
    removeItem: vi.fn(() => {
      throw new Error("SecurityError: The operation is insecure.");
    }),
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: throwsMock,
    writable: true,
  });

  // These should not crash
  expect(() => saveSession({
    lastMessage: "hello",
    language: "English",
    response: {
      type: "document" as const,
      document_name: "Aadhaar",
      purpose: "ID",
      how_to_obtain: "Enrol",
      typical_cost: "Free",
      typical_time: "15 days",
    },
    followups: [],
  })).not.toThrow();

  expect(loadSession()).toBeNull();
  expect(() => clearSession()).not.toThrow();
  expect(() => incrementInsight("journey")).not.toThrow();
  expect(getMostCommonType()).toBeNull();
  expect(() => clearAllData()).not.toThrow();

  // Restore the normal mock
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
});
