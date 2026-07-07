import { expect, test } from "vitest";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

test("API route returns valid response shape", async () => {
  const req = new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
