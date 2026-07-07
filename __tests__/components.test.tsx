import { expect, test } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import InputBar from "@/components/companion/InputBar";
import ResponseRenderer from "@/components/companion/ResponseRenderer";
import type { CompanionResponse } from "@/lib/schema";

// Suppress React 19 act() warning in JSDOM testing environment
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("InputBar renders without crashing", () => {
  const container = document.createElement("div");
  const root = createRoot(container);

  act(() => {
    root.render(
      <InputBar
        onSubmit={() => {}}
        language="English"
        onLanguageChange={() => {}}
        loading={false}
      />
    );
  });

  expect(container.innerHTML).toContain("Describe your situation");
  root.unmount();
});

test("ResponseRenderer renders document guidance without crashing", () => {
  const container = document.createElement("div");
  const root = createRoot(container);

  const mockResponse: CompanionResponse = {
    type: "document",
    document_name: "Birth Certificate",
    purpose: "Official proof of birth",
    how_to_obtain: "Register at local corporation",
    typical_cost: "Free",
    typical_time: "7 days",
  };

  act(() => {
    root.render(<ResponseRenderer response={mockResponse} />);
  });

  expect(container.innerHTML).toContain("Birth Certificate");
  root.unmount();
});
