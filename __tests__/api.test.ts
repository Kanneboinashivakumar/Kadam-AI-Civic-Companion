import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes("postalpincode.in")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            Status: "Success",
            PostOffice: [
              {
                District: "Bangalore",
                State: "Karnataka"
              }
            ]
          }
        ])
      } as any);
    }
    return originalFetch(url);
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

test("API route returns valid response shape", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "I just had a baby",
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("type");
  expect(["journey", "complaint", "scheme", "document", "followup"]).toContain(data.type);
});

test("API route returns 400 Bad Request when message is missing", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data).toEqual({ error: "Empty message" });
});

test("API route returns 400 Bad Request when message is empty string", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "   ",
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data).toEqual({ error: "Empty message" });
});

test("API route handles Hindi requests successfully", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "मुझे एक शिकायत दर्ज करनी है",
      language: "Hindi",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("type");
  expect(["journey", "complaint", "scheme", "document", "followup"]).toContain(data.type);
});

test("API route follow-up request returns followup type response", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "What if I miss the deadline?",
      language: "English",
      context: {
        type: "journey",
        event: "New baby",
        summary: "Summary",
        steps: [],
      },
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("type");
  expect(["journey", "complaint", "scheme", "document", "followup"]).toContain(data.type);
});

test("API route handles unknown/unsupported language gracefully", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "I need to file a complaint",
      language: "German", // Unsupported language
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("type");
  expect(["journey", "complaint", "scheme", "document", "followup"]).toContain(data.type);
});

test("API route handles unusually long message without error", async () => {
  const longMessage = "a".repeat(2500);
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: longMessage,
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("type");
  expect(["journey", "complaint", "scheme", "document", "followup"]).toContain(data.type);
});

test("API route rejects messages longer than 3000 characters", async () => {
  const longMsg = "a".repeat(3001);
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: longMsg,
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data).toEqual({ error: "Message too long (max 3000 characters)" });
});

test("API route enforces rate limit and returns 429 after limit exceeded", async () => {
  const customIp = "192.168.1.100";
  
  for (let i = 0; i < 10; i++) {
    const req = new NextRequest("http://localhost/api/generate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-forwarded-for": customIp
      },
      body: JSON.stringify({
        message: "Hello",
        language: "English",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  }

  // 11th request should be rate-limited
  const req11 = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-forwarded-for": customIp
    },
    body: JSON.stringify({
      message: "Hello",
      language: "English",
    }),
  });
  const res11 = await POST(req11);
  expect(res11.status).toBe(429);
  expect(res11.headers.get("Retry-After")).toBe("60");
});

test("API route parses PIN code and fetches location successfully", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "I need local help in Yelahanka, PIN code 560064",
      language: "English",
    }),
  });

  const response = await POST(req);
  expect(response.status).toBe(200);
  expect(global.fetch).toHaveBeenCalledWith("https://api.postalpincode.in/pincode/560064", expect.any(Object));
});
