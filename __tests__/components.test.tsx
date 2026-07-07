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

test("InputBar renders and submits normally when SpeechRecognition is unavailable", () => {
  // Simulate an unsupported browser: no SpeechRecognition constructors present.
  delete (window as any).SpeechRecognition;
  delete (window as any).webkitSpeechRecognition;

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

  // Mic button (labelled "Speak") must be hidden entirely, not broken.
  const micButton = container.querySelector('button[aria-label="Speak"]');
  expect(micButton).toBeNull();

  // Typing + submit must still work exactly as before.
  const input = container.querySelector("input") as HTMLInputElement;
  const form = container.querySelector("form") as HTMLFormElement;

  act(() => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(input, "I lost my job");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  });

  expect(submittedMessage).toBe("I lost my job");
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

test("SpeechRecognition integration test (start, locale selection, and transcription)", () => {
  let lastRecognitionInstance: any = null;
  const mockStart = vi.fn();

  class MockSpeechRecognition {
    lang = "";
    interimResults = false;
    continuous = false;
    onresult: any = null;
    onerror: any = null;
    onend: any = null;

    constructor() {
      lastRecognitionInstance = this;
    }

    start = mockStart;
  }

  (window as any).SpeechRecognition = MockSpeechRecognition;

  const container = document.createElement("div");
  const root = createRoot(container);

  // Test 1: Hindi locale selection
  act(() => {
    root.render(
      <InputBar
        onSubmit={() => {}}
        language="Hindi"
        onLanguageChange={() => {}}
        loading={false}
      />
    );
  });

  const micButton = container.querySelector('button[aria-label="बोलें"]') as HTMLButtonElement;
  expect(micButton).not.toBeNull();

  act(() => {
    micButton.click();
  });

  expect(mockStart).toHaveBeenCalled();
  expect(lastRecognitionInstance.lang).toBe("hi-IN");

  // Test 2: Simulating transcribed speech result
  act(() => {
    // Simulate speech recognition event
    const event = {
      results: [
        [{ transcript: "मेरा नाम कुमार है" }]
      ]
    };
    lastRecognitionInstance.onresult(event);
  });

  act(() => {
    lastRecognitionInstance.onend();
  });

  const input = container.querySelector("input") as HTMLInputElement;
  expect(input.value).toBe("मेरा नाम कुमार है");

  // Test 3: Telugu locale selection
  act(() => {
    root.render(
      <InputBar
        onSubmit={() => {}}
        language="Telugu"
        onLanguageChange={() => {}}
        loading={false}
      />
    );
  });

  const teluguMicButton = container.querySelector('button[aria-label="మాట్లాడండి"]') as HTMLButtonElement;
  act(() => {
    teluguMicButton.click();
  });
  expect(lastRecognitionInstance.lang).toBe("te-IN");

  root.unmount();
  delete (window as any).SpeechRecognition;
});

test("InputBar validation: rejects empty or whitespace-only queries and trims valid inputs", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  let submittedCount = 0;
  let submittedVal = "";

  act(() => {
    root.render(
      <InputBar
        onSubmit={(msg) => {
          submittedCount++;
          submittedVal = msg;
        }}
        language="English"
        onLanguageChange={() => {}}
        loading={false}
      />
    );
  });

  const input = container.querySelector("input") as HTMLInputElement;
  const form = container.querySelector("form") as HTMLFormElement;

  // 1. Submit empty value
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  });
  expect(submittedCount).toBe(0);

  // 2. Submit whitespace-only value
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "     ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  });
  expect(submittedCount).toBe(0);

  // 3. Submit valid untrimmed value (should submit trimmed value)
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "  My issue text here  ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  });
  expect(submittedCount).toBe(1);
  expect(submittedVal).toBe("My issue text here");

  root.unmount();
});
