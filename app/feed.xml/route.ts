import { NextResponse } from 'next/server';

export async function GET() {
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>My Portfolio &amp; Blog</title>
    <link>https://myportfolio.com</link>
    <description>Latest projects and blog posts</description>
    
    <item>
      <title>Project Alpha</title>
      <link>https://myportfolio.com/projects/alpha</link>
      <description>A cool project I built with Next.js and Tailwind CSS.</description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    
    <item>
      <title>Blog Post: Why I love TypeScript</title>
      <link>https://myportfolio.com/blog/why-i-love-typescript</link>
      <description>TypeScript makes everything better by adding static typing to JavaScript.</description>
      <pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    
    <item>
      <title>Project Beta</title>
      <link>https://myportfolio.com/projects/beta</link>
      <description>An open-source library for seamless animations.</description>
      <pubDate>Wed, 03 Jan 2024 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
