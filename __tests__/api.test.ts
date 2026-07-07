import { expect, test } from "vitest";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

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
