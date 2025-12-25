import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all keywords with their latest ranking
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      include: {
        rankings: {
          take: 1,
          orderBy: {
            checkedAt: 'desc',
          },
        },
      },
    });

    const formattedKeywords = keywords.map((kw) => ({
      id: kw.id,
      keyword: kw.keyword,
      targetUrl: kw.targetUrl,
      latestRanking: kw.rankings[0]
        ? {
            position: kw.rankings[0].position,
            checkedAt: kw.rankings[0].checkedAt.toISOString(),
          }
        : undefined,
    }));

    return NextResponse.json({ keywords: formattedKeywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

// POST: Add a new keyword
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, targetUrl } = body;

    if (!keyword || !targetUrl) {
      return NextResponse.json(
        { error: 'Keyword and target URL are required' },
        { status: 400 }
      );
    }

    // Check if keyword already exists
    const existing = await prisma.keyword.findUnique({
      where: { keyword },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Keyword already exists' },
        { status: 400 }
      );
    }

    const newKeyword = await prisma.keyword.create({
      data: {
        keyword,
        targetUrl,
      },
    });

    return NextResponse.json({ keyword: newKeyword }, { status: 201 });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a keyword
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    await prisma.keyword.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
