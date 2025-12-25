import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchGoogle, findUrlPosition } from '@/lib/serp';

// GET: Check rankings for all keywords
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keywords = await prisma.keyword.findMany();

    if (keywords.length === 0) {
      return NextResponse.json({
        message: 'No keywords to check',
        results: [],
      });
    }

    const results = [];

    for (const keyword of keywords) {
      try {
        // Search Google for the keyword
        const searchResults = await searchGoogle(keyword.keyword);

        // Find position of target URL
        const position = findUrlPosition(searchResults, keyword.targetUrl);

        if (position !== null) {
          // Save the ranking
          const ranking = await prisma.ranking.create({
            data: {
              keywordId: keyword.id,
              position,
              url: keyword.targetUrl,
              title: searchResults[position - 1]?.title || '',
              snippet: searchResults[position - 1]?.snippet || '',
            },
          });

          results.push({
            keyword: keyword.keyword,
            position,
            success: true,
          });
        } else {
          // URL not found in top 10
          results.push({
            keyword: keyword.keyword,
            position: null,
            success: true,
            message: 'URL not found in top 10 results',
          });
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error checking keyword "${keyword.keyword}":`, error);
        results.push({
          keyword: keyword.keyword,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Ranking check completed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in check-rankings:', error);
    return NextResponse.json(
      { error: 'Failed to check rankings' },
      { status: 500 }
    );
  }
}
