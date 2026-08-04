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
    const input = String(url.searchParams.get('input') || '').trim();
    const language = String(url.searchParams.get('language') || 'en').trim() || 'en';
    const apiKey = getGooglePlacesApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { status: 'CONFIG_ERROR', error_message: 'Google Places API key is missing in Vercel.' },
        { status: 500 }
      );
    }

    if (input.length < 3) {
      return NextResponse.json({ status: 'ZERO_RESULTS', predictions: [] });
    }

    const params = new URLSearchParams({
      input,
      key: apiKey,
      components: 'country:jo',
      language,
      location: '31.9539,35.9106',
      radius: '60000',
    });

    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`,
      { cache: 'no-store' }
    );

    const json = await googleResponse.json();

    return NextResponse.json(json, { status: googleResponse.ok ? 200 : googleResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'SERVER_ERROR',
        error_message: error instanceof Error ? error.message : 'Could not search Google Places.',
        predictions: [],
      },
      { status: 500 }
    );
  }
}
