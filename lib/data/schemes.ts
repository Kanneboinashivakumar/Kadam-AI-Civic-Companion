// Curated real-scheme dataset used to GROUND the model's scheme recommendations.
// Every entry is a genuine Government of India scheme with real eligibility,
// benefit, and official source. The route injects the relevant subset into the
// Gemini prompt and then annotates responses (grounded/source) against this list.
// This is the single source of truth for grounded scheme data — do not invent
// scheme names anywhere else.

import type { SchemeMatch } from "../schema";

export type CuratedScheme = {
  name: string;
  eligibility: string;
  benefit: string;
  source: string; // official department / portal
  apply: string; // short "how to apply"
  tags: string[]; // life-event tags used for message matching
};

export const CURATED_SCHEMES: CuratedScheme[] = [
  {
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    eligibility:
      "Pregnant and lactating mothers aged 19+ for the first living child; a further instalment cycle applies for a second child if it is a girl. Registered at an Anganwadi or approved health facility.",
    benefit:
      "Cash incentive of ₹5,000 (in instalments) for the first child, paid directly to the mother's bank account, in addition to JSY benefit on institutional delivery.",
    source: "Ministry of Women & Child Development (wcd.nic.in / PMMVY portal)",
    apply:
      "Register at your nearest Anganwadi centre or approved health facility, or apply on the PMMVY portal.",
    tags: ["childbirth", "health"],
  },
  {
    name: "Janani Suraksha Yojana (JSY)",
    eligibility:
      "Pregnant women opting for institutional delivery; all women in low-performing states, and BPL/SC/ST women in high-performing states.",
    benefit:
      "One-time cash assistance for delivering in a government or accredited facility (amount varies by state and rural/urban), plus support from an ASHA worker.",
    source: "Ministry of Health & Family Welfare, National Health Mission",
    apply:
      "Contact your ASHA worker or the delivery facility; assistance is disbursed at or after institutional delivery.",
    tags: ["childbirth", "health"],
  },
  {
    name: "Sukanya Samriddhi Yojana",
    eligibility:
      "Parents/guardians of a girl child below 10 years; one account per girl child, up to two accounts per family.",
    benefit:
      "High-interest, tax-free small savings account for a girl child's education and marriage; minimum ₹250 and up to ₹1.5 lakh per year.",
    source: "Ministry of Finance (India Post / authorised banks)",
    apply:
      "Open the account at any post office or authorised bank branch with the girl's birth certificate and guardian ID.",
    tags: ["childbirth", "girl_child"],
  },
  {
    name: "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    eligibility:
      "Economically weaker families identified by SECC 2011 deprivation criteria and state-extended lists; no cap on family size or age.",
    benefit:
      "Cashless health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation at empanelled hospitals.",
    source: "National Health Authority (pmjay.gov.in)",
    apply:
      "Check eligibility at pmjay.gov.in or a Common Service Centre and get your Ayushman card made at an empanelled hospital/CSC.",
    tags: ["health"],
  },
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    eligibility:
      "EWS/LIG/MIG families without a pucca house in their name (Urban and Gramin variants); income-based categories, with priority to women ownership.",
    benefit:
      "Financial assistance or interest subsidy to build or buy a home (credit-linked subsidy under CLSS, or construction assistance).",
    source:
      "Ministry of Housing & Urban Affairs / Ministry of Rural Development (pmaymis.gov.in)",
    apply:
      "Apply through the PMAY-U / PMAY-G portal, your urban local body, or Gram Panchayat.",
    tags: ["housing", "relocation"],
  },
  {
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    eligibility:
      "Individuals above 18 setting up a new micro-enterprise; SHGs, institutions and co-operatives also eligible. Project cost caps apply (₹50 lakh manufacturing / ₹20 lakh service).",
    benefit:
      "Credit-linked subsidy of 15–35% of project cost (higher for special categories and rural areas).",
    source: "Ministry of MSME / KVIC (kviconline.gov.in)",
    apply:
      "Apply online on the PMEGP e-portal; the loan is routed through participating banks.",
    tags: ["business", "job_loss"],
  },
  {
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    eligibility:
      "Non-corporate, non-farm micro and small enterprises and aspiring entrepreneurs needing working capital or a term loan.",
    benefit:
      "Collateral-free loans up to ₹10 lakh in three categories — Shishu (up to ₹50k), Kishore (up to ₹5 lakh), Tarun (up to ₹10 lakh).",
    source:
      "Micro Units Development & Refinance Agency (MUDRA), Dept of Financial Services",
    apply:
      "Apply at any bank, NBFC or MFI, or via the Jan Samarth / udyamimitra portal.",
    tags: ["business", "job_loss"],
  },
  {
    name: "Stand-Up India",
    eligibility:
      "SC/ST and/or women entrepreneurs aged 18+, for a greenfield (first-time) enterprise in manufacturing, services or trading.",
    benefit:
      "Bank loans between ₹10 lakh and ₹1 crore for setting up a new enterprise.",
    source: "Department of Financial Services (standupmitra.in)",
    apply: "Apply through the Stand-Up India portal or your bank branch.",
    tags: ["business"],
  },
  {
    name: "Atal Pension Yojana (APY)",
    eligibility:
      "Indian citizens aged 18–40 with a savings bank account, aimed mainly at unorganised-sector workers.",
    benefit:
      "Guaranteed monthly pension of ₹1,000–₹5,000 after age 60, based on contributions.",
    source: "Pension Fund Regulatory and Development Authority (PFRDA)",
    apply:
      "Enrol through the bank or post office where you hold a savings account.",
    tags: ["job_loss", "pension"],
  },
  {
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    eligibility:
      "Bank or post-office account holders aged 18–70 with auto-debit consent.",
    benefit:
      "Accidental death or full disability cover of ₹2 lakh (₹1 lakh partial) for a premium of ₹20 per year.",
    source: "Department of Financial Services",
    apply: "Enable it through your bank or post office savings account.",
    tags: ["insurance", "job_loss"],
  },
  {
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    eligibility:
      "Bank or post-office account holders aged 18–50 with auto-debit consent.",
    benefit:
      "Life insurance cover of ₹2 lakh on death from any cause for a premium of ₹436 per year.",
    source: "Department of Financial Services",
    apply: "Enrol through your bank or post office savings account.",
    tags: ["insurance"],
  },
  {
    name: "National Career Service (NCS)",
    eligibility: "Any jobseeker, employer or skill-seeker; free registration.",
    benefit:
      "Job matching, career counselling, skill and apprenticeship links, and access to job fairs through a single portal.",
    source: "Ministry of Labour & Employment (ncs.gov.in)",
    apply: "Register free at ncs.gov.in or at a Model Career Centre.",
    tags: ["job_loss"],
  },
  {
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    eligibility:
      "Indian youth who are unemployed or school/college dropouts seeking skilling; training is free.",
    benefit:
      "Free short-term skill training, assessment and certification, with placement support.",
    source: "Ministry of Skill Development & Entrepreneurship (MSDE)",
    apply:
      "Enrol at a PMKVY training centre or via the Skill India Digital portal.",
    tags: ["job_loss"],
  },
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    eligibility:
      "Landholding farmer families, subject to exclusion criteria for higher-income groups and taxpayers.",
    benefit:
      "Income support of ₹6,000 per year in three equal instalments, paid directly to bank accounts.",
    source: "Ministry of Agriculture & Farmers Welfare (pmkisan.gov.in)",
    apply:
      "Register at pmkisan.gov.in, a Common Service Centre, or with the village revenue/agriculture officer.",
    tags: ["farmer"],
  },
  {
    name: "National Social Assistance Programme (NSAP)",
    eligibility:
      "BPL households — old-age persons (60+), widows (40+), and persons with severe disability, under the respective pension schemes.",
    benefit:
      "Monthly pension (old-age, widow and disability pensions), with amounts often topped up by states.",
    source: "Ministry of Rural Development",
    apply:
      "Apply through your Gram Panchayat, municipality, or state social welfare department.",
    tags: ["pension", "senior"],
  },
  {
    name: "One Nation One Ration Card (ONORC)",
    eligibility:
      "Any ration card holder covered under the National Food Security Act.",
    benefit:
      "Portable ration access — draw your food-grain entitlement from any Fair Price Shop anywhere in India, useful when you migrate or relocate.",
    source: "Department of Food & Public Distribution",
    apply:
      "No separate application — carry your existing NFSA ration card / Aadhaar and use any Fair Price Shop.",
    tags: ["relocation", "food"],
  },
];

export const CURATED_SCHEME_NAMES: Set<string> = new Set(
  CURATED_SCHEMES.map((s) => s.name)
);

const TAG_KEYWORDS: Record<string, RegExp> = {
  childbirth: /baby|born|birth|pregnan|maternity|newborn|deliver|infant|child/i,
  girl_child: /girl|daughter|beti/i,
  business:
    /business|startup|start-up|enterprise|shop|self.?employ|entrepreneur|msme|udyam|\bloan\b/i,
  job_loss:
    /job|unemploy|laid off|lost my job|fired|\bwork\b|career|skill|employ/i,
  housing: /house|home|housing|awas|roof|\brent\b|pucca/i,
  relocation: /relocat|moving|move to|shift|migrat|new city|another state/i,
  health: /health|hospital|medical|illness|treatment|surgery|\bsick\b/i,
  farmer: /farm|kisan|\bcrop\b|agricultur|cultivat/i,
  pension: /pension|retire|old age|widow|elderly|senior/i,
  food: /ration|food grain|\bpds\b|fair price/i,
  insurance: /insurance|accident|life cover|bima/i,
};

// Pick the curated schemes relevant to a user's message (by life-event tags).
// Falls back to the whole list when nothing matches, so scheme recommendations
// are always grounded in real data.
export function selectSchemesForMessage(message: string): CuratedScheme[] {
  const text = message || "";
  const matchedTags = new Set<string>();
  for (const [tag, re] of Object.entries(TAG_KEYWORDS)) {
    if (re.test(text)) matchedTags.add(tag);
  }
  if (matchedTags.size === 0) return CURATED_SCHEMES;
  const hits = CURATED_SCHEMES.filter((s) =>
    s.tags.some((t) => matchedTags.has(t))
  );
  return hits.length > 0 ? hits : CURATED_SCHEMES;
}

export function pickSchemesByName(names: string[]): CuratedScheme[] {
  return names
    .map((n) => CURATED_SCHEMES.find((s) => s.name === n))
    .filter((s): s is CuratedScheme => Boolean(s));
}

// Convert a curated scheme into the wire-format SchemeMatch the UI expects,
// pre-marked as grounded with its official source.
export function toSchemeMatch(scheme: CuratedScheme): SchemeMatch {
  return {
    name: scheme.name,
    eligibility_reasoning: scheme.eligibility,
    benefit_summary: scheme.benefit,
    how_to_apply: scheme.apply,
    source: scheme.source,
    grounded: true,
  };
}

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Authoritatively annotate model-produced scheme matches against the curated
// dataset: grounded=true + real source when the name matches a curated scheme,
// grounded=false otherwise. Existing fields are preserved untouched.
export function groundSchemeMatches(matches: SchemeMatch[]): SchemeMatch[] {
  if (!Array.isArray(matches)) return matches;
  return matches.map((m) => {
    const mn = normalize(m.name);
    const curated = CURATED_SCHEMES.find((c) => {
      const cn = normalize(c.name);
      return cn === mn || cn.includes(mn) || mn.includes(cn);
    });
    if (curated) {
      return { ...m, grounded: true, source: curated.source };
    }
    return { ...m, grounded: false };
  });
}
