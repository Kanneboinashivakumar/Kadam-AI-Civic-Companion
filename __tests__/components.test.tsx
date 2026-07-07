import { expect, test } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import InputBar from "@/components/companion/InputBar";
import ResponseRenderer from "@/components/companion/ResponseRenderer";
import SuggestionChips from "@/components/companion/SuggestionChips";
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

test("SuggestionChips triggers onPick with English prompt value when clicked", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  let pickedMessage = "";

  act(() => {
    root.render(
      <SuggestionChips
        onPick={(msg) => {
          pickedMessage = msg;
        }}
        disabled={false}
        chipLabels={["मेरा बच्चा हुआ है", "स्ट्रीटलाइट", "पात्रता", "व्यापार", "नौकरी"]}
      />
    );
  });

  const buttons = container.querySelectorAll("button");
  expect(buttons.length).toBe(5);

  // Click the first button (which represents "I just had a baby")
  act(() => {
    buttons[0].click();
  });

  expect(pickedMessage).toContain("I just had a baby in Karnataka");
  root.unmount();
});

test("InputBar triggers onSubmit with typed value", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  let submittedMessage = "";

  act(() => {
    root.render(
      <InputBar
        onSubmit={(msg) => {
          submittedMessage = msg;
        }}
        language="English"
        onLanguageChange={() => {}}
        loading={false}
      />
    );
  });

  const input = container.querySelector("input") as HTMLInputElement;
  const form = container.querySelector("form") as HTMLFormElement;

  // Simulate typing using React-compatible value setter
  act(() => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(input, "Help with passport application");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  // Submit the form
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  });

  expect(submittedMessage).toBe("Help with passport application");
  root.unmount();
});
