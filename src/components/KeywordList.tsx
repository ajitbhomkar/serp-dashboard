'use client';

import { useEffect, useState } from 'react';

interface Keyword {
  id: string;
  keyword: string;
  targetUrl: string;
  latestRanking?: {
    position: number;
    checkedAt: string;
  };
}

export default function KeywordList() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/keywords');
      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) return;

    try {
      const response = await fetch(`/api/keywords?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setKeywords(keywords.filter((k) => k.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete keyword:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Tracked Keywords
        </h2>
        {keywords.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No keywords tracked yet. Add your first keyword above!
          </p>
        ) : (
          <div className="space-y-3">
            {keywords.map((kw) => (
              <div
                key={kw.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {kw.keyword}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {kw.targetUrl}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {kw.latestRanking && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        #{kw.latestRanking.position}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Latest rank
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(kw.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete keyword"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
