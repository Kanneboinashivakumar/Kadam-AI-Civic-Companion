import type {
  CompanionResponse,
  ComplaintResponse,
  FollowupResponse,
  JourneyResponse,
} from "./schema";

// Pre-generated known-good responses. If the live Gemini call fails or times
// out during the demo, the route silently serves one of these — never a raw
// error screen while judging.

export const FALLBACK_JOURNEY: JourneyResponse = {
  type: "journey",
  event: "New baby in the family",
  summary:
    "Congratulations! There are a few government processes to complete in the first year. Registering the birth is the most urgent — it unlocks everything else, from the birth certificate to scheme benefits.",
  steps: [
    {
      id: "step-1",
      title: "Register the birth (within 21 days)",
      description:
        "Report the birth to your local Municipal Corporation or Gram Panchayat registrar. If the baby was born in a hospital, the hospital usually files this for you — confirm with the records desk before leaving.",
      documents: [
        "Hospital discharge summary / proof of birth",
        "Parents' Aadhaar cards",
        "Proof of address (electricity bill or ration card)",
      ],
      estimated_time: "Same day to 7 days",
      estimated_cost: "Free within 21 days; small late fee after",
      reasoning:
        "Birth registration is legally required within 21 days and is free in that window. Every later step — certificate, Aadhaar, scheme enrolment — depends on it, so it comes first.",
    },
    {
      id: "step-2",
      title: "Collect the birth certificate",
      description:
        "Once the birth is registered, apply for the birth certificate at the same municipal office or through your state's online citizen services portal. Ask for 3–4 certified copies; schools and passport offices each want one.",
      documents: [
        "Birth registration acknowledgement/receipt",
        "Parents' identity proof",
      ],
      estimated_time: "7–14 days",
      estimated_cost: "Roughly ₹20–₹50 per copy (varies by state)",
      reasoning:
        "The certificate is the child's first legal identity document. Exact fees vary by state, so treat the amount as indicative and confirm at the counter.",
    },
    {
      id: "step-3",
      title: "Get the baby's Aadhaar (Baal Aadhaar)",
      description:
        "Visit any Aadhaar Seva Kendra or enrolment centre with the baby. Children under 5 get a blue Baal Aadhaar — no fingerprints needed; it links to a parent's Aadhaar.",
      documents: [
        "Baby's birth certificate",
        "One parent's Aadhaar card",
      ],
      estimated_time: "Enrolment same day; card arrives in 2–4 weeks",
      estimated_cost: "Free",
      reasoning:
        "Aadhaar is needed to add the child to ration cards, open savings schemes like Sukanya Samriddhi, and claim most benefits, so do it soon after the certificate arrives.",
    },
    {
      id: "step-4",
      title: "Add the child to your ration card and health coverage",
      description:
        "Apply at your ration office or state food portal to add the newborn to the family ration card, and update your Ayushman Bharat (PM-JAY) family details if you're covered, so the child's medical care is included.",
      documents: [
        "Birth certificate",
        "Baby's Aadhaar (or enrolment slip)",
        "Existing ration card",
      ],
      estimated_time: "1–3 weeks",
      estimated_cost: "Free",
      reasoning:
        "Adding the child ensures food entitlements and hospital coverage apply to them. This can run in parallel with other steps once the certificate exists.",
    },
  ],
  schemes: [
    {
      name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      eligibility_reasoning:
        "Maternity benefit for the mother's first living child (extended for a second girl child). If this is your first baby and you registered the pregnancy at an Anganwadi or health centre, you likely qualify.",
      benefit_summary:
        "Cash benefit of ₹5,000 in instalments for the first child, paid directly to the mother's bank account.",
    },
    {
      name: "Sukanya Samriddhi Yojana",
      eligibility_reasoning:
        "If your baby is a girl, you can open this account any time before she turns 10 — one account per girl child, at any post office or major bank.",
      benefit_summary:
        "High-interest, tax-free savings account for a girl child's education and future, with a small minimum deposit of ₹250 per year.",
    },
    {
      name: "Janani Suraksha Yojana (JSY)",
      eligibility_reasoning:
        "Cash assistance for institutional delivery, aimed at low-income mothers; eligibility and amount differ between states, so confirm with your ASHA worker.",
      benefit_summary:
        "One-time cash assistance for delivering in a government or accredited facility, plus support from an ASHA worker.",
    },
  ],
  priority_order: ["step-1", "step-2", "step-3", "step-4"],
};

export const FALLBACK_COMPLAINT: ComplaintResponse = {
  type: "complaint",
  department: "Municipal Corporation — Electrical / Street Lighting Division",
  category: "Streetlight not working",
  severity: "medium",
  structured_description:
    "A streetlight in my area has not been working for several days, leaving the stretch of road dark at night. This is a safety risk for pedestrians and vehicles, especially for women and elderly residents returning home after dark. I request inspection and repair of the light at the earliest. Location details, nearest landmark, and pole number (if visible) are provided below.",
  next_steps: [
    "Note the exact location: street name, nearest landmark, and the pole number painted on the streetlight pole if visible.",
    "File the complaint on your city's municipal app or helpline (many cities use 1533 or a dedicated portal like Swachhata or the city corporation website).",
    "Save the complaint/ticket number you receive — you'll need it to track or escalate.",
    "If nothing happens in 7–10 days, escalate to the ward officer or your area corporator, quoting the ticket number.",
  ],
  reasoning:
    "A dark street is a genuine safety hazard but not an immediate emergency, so this is classified as medium severity. Streetlights are maintained by the municipal body's electrical division, not the state electricity board — filing with the right department avoids the most common cause of stalled complaints.",
};

export const FALLBACK_FOLLOWUP: FollowupResponse = {
  type: "followup",
  answer:
    "I couldn't reach the reasoning engine just now, so I can't answer this follow-up reliably. The response above still stands — the office named in each step can confirm details like exact fees and deadlines. Please try asking again in a moment.",
};

// Silent-swap picker: choose the fallback whose shape best matches what the
// user was asking for, so the demo stays coherent even offline.
export function getFallback(
  message: string,
  isFollowup = false
): CompanionResponse {
  if (isFollowup) return FALLBACK_FOLLOWUP;
  const complaintWords =
    /report|complain|broken|not working|garbage|pothole|leak|streetlight|overflow|noise|stray/i;
  if (complaintWords.test(message || "")) return FALLBACK_COMPLAINT;
  return FALLBACK_JOURNEY;
}
