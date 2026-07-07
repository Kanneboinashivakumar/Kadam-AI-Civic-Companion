import { expect, test, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import ResponseRenderer from "@/components/companion/ResponseRenderer";
import type { CompanionResponse } from "@/lib/schema";

// Suppress React 19 act() warning in JSDOM testing environment
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("ResponseRenderer catches render error and displays fallback", () => {
  const container = document.createElement("div");
  const root = createRoot(container);

  // Suppress expected console.error outputs from the intentionally thrown error
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  const brokenResponse = {
    type: "journey",
    steps: null, // Will cause JourneyStepper to crash on render (TypeError mapping null)
  } as unknown as CompanionResponse;

  act(() => {
    root.render(<ResponseRenderer response={brokenResponse} />);
  });

  expect(container.innerHTML).toContain("Something went wrong displaying this response");
  
  spy.mockRestore();
  root.unmount();
});

test("ResponseRenderer renders normal response without error", () => {
  const container = document.createElement("div");
  const root = createRoot(container);

  const normalResponse: CompanionResponse = {
    type: "document",
    document_name: "Passport",
    purpose: "Travel identity",
    how_to_obtain: "Apply online",
    typical_cost: "Rs. 1500",
    typical_time: "15 days",
  };

  act(() => {
    root.render(<ResponseRenderer response={normalResponse} />);
  });

  expect(container.innerHTML).not.toContain("Something went wrong displaying this response");
  expect(container.innerHTML).toContain("Passport");
  root.unmount();
});
