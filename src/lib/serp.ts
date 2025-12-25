import axios from 'axios';

export interface SearchResult {
  position: number;
  url: string;
  title: string;
  snippet: string;
}

/**
 * Searches Google for a keyword and returns results
 * Uses Google Custom Search JSON API
 */
export async function searchGoogle(
  keyword: string
): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    throw new Error('Google API credentials not configured');
  }

  try {
    const response = await axios.get(
      'https://www.googleapis.com/customsearch/v1',
      {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: keyword,
          num: 10,
        },
      }
    );

    const results: SearchResult[] = [];

    if (response.data.items) {
      response.data.items.forEach((item: any, index: number) => {
        results.push({
          position: index + 1,
          url: item.link,
          title: item.title,
          snippet: item.snippet || '',
        });
      });
    }

    return results;
  } catch (error) {
    console.error('Error searching Google:', error);
    throw new Error('Failed to fetch search results');
  }
}

/**
 * Finds the position of a target URL in search results
 */
export function findUrlPosition(
  results: SearchResult[],
  targetUrl: string
): number | null {
  // Normalize URLs for comparison
  const normalizeUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + parsed.pathname.replace(/\/$/, '');
    } catch {
      return url;
    }
  };

  const normalizedTarget = normalizeUrl(targetUrl);

  for (const result of results) {
    const normalizedResult = normalizeUrl(result.url);
    if (normalizedResult === normalizedTarget) {
      return result.position;
    }
  }

  return null; // URL not found in top 10 results
}
