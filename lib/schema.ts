// Single source of truth for response types + the Gemini structured-output
// schema. Shapes must match PROMPTS.md exactly.

export type JourneyStep = {
  id: string;
  title: string;
  description: string;
  documents: string[];
  estimated_time: string;
  estimated_cost: string;
  reasoning: string;
};

export type SchemeMatch = {
  name: string;
  eligibility_reasoning: string;
  benefit_summary: string;
  how_to_apply?: string;
};

export type JourneyResponse = {
  type: "journey";
  event: string;
  summary: string;
  steps: JourneyStep[];
  schemes: SchemeMatch[];
  priority_order: string[];
};

export type ComplaintResponse = {
  type: "complaint";
  department: string;
  category: string;
  severity: "low" | "medium" | "high";
  structured_description: string;
  next_steps: string[];
  reasoning: string;
};

export type SchemeResponse = {
  type: "scheme";
  matches: SchemeMatch[];
};

export type DocumentResponse = {
  type: "document";
  document_name: string;
  purpose: string;
  how_to_obtain: string;
  typical_cost: string;
  typical_time: string;
};

export type FollowupResponse = {
  type: "followup";
  answer: string;
};

export type CompanionResponse =
  | JourneyResponse
  | ComplaintResponse
  | SchemeResponse
  | DocumentResponse
  | FollowupResponse;

const str = { type: "string" };
const strArr = { type: "array", items: str };

const journeySchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["journey"] },
    event: str,
    summary: str,
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: str,
          title: str,
          description: str,
          documents: strArr,
          estimated_time: str,
          estimated_cost: str,
          reasoning: str,
        },
        required: [
          "id",
          "title",
          "description",
          "documents",
          "estimated_time",
          "estimated_cost",
          "reasoning",
        ],
      },
    },
    schemes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: str,
          eligibility_reasoning: str,
          benefit_summary: str,
        },
        required: ["name", "eligibility_reasoning", "benefit_summary"],
      },
    },
    priority_order: strArr,
  },
  required: ["type", "event", "summary", "steps", "schemes", "priority_order"],
};

const complaintSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["complaint"] },
    department: str,
    category: str,
    severity: { type: "string", enum: ["low", "medium", "high"] },
    structured_description: str,
    next_steps: strArr,
    reasoning: str,
  },
  required: [
    "type",
    "department",
    "category",
    "severity",
    "structured_description",
    "next_steps",
    "reasoning",
  ],
};

const schemeSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["scheme"] },
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: str,
          eligibility_reasoning: str,
          benefit_summary: str,
          how_to_apply: str,
        },
        required: [
          "name",
          "eligibility_reasoning",
          "benefit_summary",
          "how_to_apply",
        ],
      },
    },
  },
  required: ["type", "matches"],
};

const documentSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["document"] },
    document_name: str,
    purpose: str,
    how_to_obtain: str,
    typical_cost: str,
    typical_time: str,
  },
  required: [
    "type",
    "document_name",
    "purpose",
    "how_to_obtain",
    "typical_cost",
    "typical_time",
  ],
};

const followupSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["followup"] },
    answer: str,
  },
  required: ["type", "answer"],
};

export const RESPONSE_JSON_SCHEMA = {
  anyOf: [
    journeySchema,
    complaintSchema,
    schemeSchema,
    documentSchema,
    followupSchema,
  ],
};
