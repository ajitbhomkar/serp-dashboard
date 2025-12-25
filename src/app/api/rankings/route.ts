import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch ranking history for all keywords
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      include: {
        rankings: {
          orderBy: {
            checkedAt: 'asc',
          },
          take: 30, // Last 30 data points per keyword
        },
      },
    });

    const rankings = keywords.map((kw) => ({
      keyword: kw.keyword,
      data: kw.rankings.map((r) => ({
        date: r.checkedAt.toISOString(),
        position: r.position,
      })),
    }));

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
