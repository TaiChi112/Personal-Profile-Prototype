import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // 1. Try Google Books API first
    const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`);
    const googleData = await googleRes.json();

    // If Google Books succeeds and has items, return it
    if (googleRes.ok && googleData.items && googleData.items.length > 0) {
      return NextResponse.json(googleData);
    }
    
    // If we hit a rate limit (429) or no items, fallback to OpenLibrary API
    console.log("Google Books API failed or empty, falling back to OpenLibrary...");
    
    const openLibRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=40`);
    if (!openLibRes.ok) {
      return NextResponse.json({ error: "Both Google Books and OpenLibrary failed." }, { status: 500 });
    }

    const openLibData = await openLibRes.json();
    
    // Map OpenLibrary data to Google Books schema
    const mappedItems = openLibData.docs.map((doc: any) => ({
      id: doc.key.replace('/works/', ''),
      volumeInfo: {
        title: doc.title,
        authors: doc.author_name || ['Unknown Author'],
        publishedDate: doc.first_publish_year ? doc.first_publish_year.toString() : 'Unknown',
        pageCount: doc.number_of_pages_median || Math.floor(Math.random() * 300) + 100, // mock if missing
        categories: doc.subject ? doc.subject.slice(0, 3) : ['General'],
        description: `This is a fallback book from OpenLibrary. Real descriptions are limited in this API. First published in ${doc.first_publish_year}.`,
        imageLinks: {
          thumbnail: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://via.placeholder.com/128x192.png?text=No+Cover'
        },
        previewLink: `https://openlibrary.org${doc.key}`
      }
    }));

    return NextResponse.json({ items: mappedItems, fallback: true });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
