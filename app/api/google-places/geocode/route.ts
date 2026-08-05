import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getGoogleMapsApiKey() {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ""
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const latitude = Number(url.searchParams.get("lat"));
    const longitude = Number(url.searchParams.get("lng"));
    const language = String(url.searchParams.get("language") || "en").trim() || "en";
    const apiKey = getGoogleMapsApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { status: "CONFIG_ERROR", error_message: "Google Maps API key is missing in Vercel." },
        { status: 500 }
      );
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { status: "INVALID_REQUEST", error_message: "Valid lat and lng values are required." },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      latlng: `${latitude},${longitude}`,
      key: apiKey,
      language,
    });

    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
      { cache: "no-store" }
    );
    const json = await googleResponse.json();

    return NextResponse.json(json, { status: googleResponse.ok ? 200 : googleResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: "SERVER_ERROR",
        error_message: error instanceof Error ? error.message : "Could not identify this location.",
        results: [],
      },
      { status: 500 }
    );
  }
}
