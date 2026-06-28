import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type QuotePayload = {
  fullName?: string;
  company?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  preferredContact?: string;
  projectType?: string;
  buildNeeded?: string[];
  budgetRange?: string;
  timeline?: string;
  referenceLink?: string;
  projectIdea?: string;
  mainUsers?: string;
  importantFeatures?: string;
  extraNotes?: string;
  website?: string;
};

function clean(value: unknown, maxLength = 3000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clean(item, 120))
    .filter(Boolean)
    .slice(0, 20);
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  return { url, serviceKey };
}

export async function POST(request: NextRequest) {
  const { url, serviceKey } = getSupabaseConfig();

  if (!url || !serviceKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Quote system is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the project environment variables.",
      },
      { status: 500 }
    );
  }

  let body: QuotePayload;

  try {
    body = (await request.json()) as QuotePayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid quote request." },
      { status: 400 }
    );
  }

  // Hidden honeypot field. Real visitors never fill this. Bots often do.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = clean(body.fullName, 160);
  const email = clean(body.email, 220);
  const whatsapp = clean(body.whatsapp, 80);
  const projectIdea = clean(body.projectIdea, 5000);

  if (!fullName) {
    return NextResponse.json(
      { ok: false, message: "Please enter your full name." },
      { status: 400 }
    );
  }

  if (!whatsapp) {
    return NextResponse.json(
      { ok: false, message: "Please enter your WhatsApp number." },
      { status: 400 }
    );
  }

  if (!projectIdea) {
    return NextResponse.json(
      { ok: false, message: "Please describe the app or system you want to build." },
      { status: 400 }
    );
  }

  const payload = {
    full_name: fullName,
    company: clean(body.company, 180),
    email,
    whatsapp,
    country: clean(body.country, 120),
    preferred_contact: clean(body.preferredContact, 80),
    project_type: clean(body.projectType, 160),
    build_needed: cleanArray(body.buildNeeded),
    budget_range: clean(body.budgetRange, 120),
    timeline: clean(body.timeline, 120),
    reference_link: clean(body.referenceLink, 600),
    project_idea: projectIdea,
    main_users: clean(body.mainUsers, 3000),
    important_features: clean(body.importantFeatures, 5000),
    extra_notes: clean(body.extraNotes, 3000),
    source: "getdarik.com/dariktech/quote",
    user_agent: clean(request.headers.get("user-agent"), 500),
  };

  try {
    const response = await fetch(`${url}/rest/v1/dariktech_quote_requests`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("DarikTech quote insert failed:", details);
      return NextResponse.json(
        { ok: false, message: "Could not save the quote request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DarikTech quote request error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error while saving the quote request." },
      { status: 500 }
    );
  }
}
