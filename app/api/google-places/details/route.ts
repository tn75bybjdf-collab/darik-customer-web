import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getGooglePlacesApiKey() {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ''
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const placeId = String(url.searchParams.get('place_id') || '').trim();
    const language = String(url.searchParams.get('language') || 'en').trim() || 'en';
    const apiKey = getGooglePlacesApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { status: 'CONFIG_ERROR', error_message: 'Google Places API key is missing in Vercel.' },
        { status: 500 }
      );
    }

    if (!placeId) {
      return NextResponse.json(
        { status: 'INVALID_REQUEST', error_message: 'place_id is required.' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      place_id: placeId,
      key: apiKey,
      fields: 'name,formatted_address,geometry',
      language,
    });

    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
      { cache: 'no-store' }
    );

    const json = await googleResponse.json();

    return NextResponse.json(json, { status: googleResponse.ok ? 200 : googleResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'SERVER_ERROR',
        error_message: error instanceof Error ? error.message : 'Could not load Google Place details.',
      },
      { status: 500 }
    );
  }
}
