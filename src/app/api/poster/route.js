import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://letterboxd.com/film/${slug}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const match = html.match(/https:\/\/a\.ltrbxd\.com\/resized\/[^"]+\.jpg/);
    
    if (match) {
      return NextResponse.json({ poster: match[0] });
    }
    
    return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

