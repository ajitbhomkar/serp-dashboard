'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface RankingData {
  keyword: string;
  data: {
    date: string;
    position: number;
  }[];
}

export default function KeywordRankingChart() {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      setRankingData(data.rankings || []);
      // Select all keywords by default
      setSelectedKeywords(data.rankings?.map((r: RankingData) => r.keyword) || []);
    } catch (error) {
      console.error('Failed to fetch ranking data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    );
  }

  if (rankingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          No ranking data available yet. Check rankings to populate the chart!
        </p>
      </div>
    );
  }

  // Combine all data points into a single dataset for the chart
  const chartData: any[] = [];
  const allDates = new Set<string>();

  rankingData.forEach((kw) => {
    kw.data.forEach((d) => allDates.add(d.date));
  });

  const sortedDates = Array.from(allDates).sort();

  sortedDates.forEach((date) => {
    const dataPoint: any = { date: format(new Date(date), 'MMM dd') };
    rankingData.forEach((kw) => {
      const ranking = kw.data.find((d) => d.date === date);
      if (ranking && selectedKeywords.includes(kw.keyword)) {
        dataPoint[kw.keyword] = ranking.position;
      }
    });
    chartData.push(dataPoint);
  });

  const colors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];

  return (
    <div>
      {/* Keyword filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {rankingData.map((kw, index) => (
          <button
            key={kw.keyword}
            onClick={() => {
              setSelectedKeywords((prev) =>
                prev.includes(kw.keyword)
                  ? prev.filter((k) => k !== kw.keyword)
                  : [...prev, kw.keyword]
              );
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedKeywords.includes(kw.keyword)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            style={
              selectedKeywords.includes(kw.keyword)
                ? { backgroundColor: colors[index % colors.length] }
                : {}
            }
          >
            {kw.keyword}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            reversed
            domain={[1, 100]}
            label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          {rankingData.map((kw, index) => (
            selectedKeywords.includes(kw.keyword) && (
              <Line
                key={kw.keyword}
                type="monotone"
                dataKey={kw.keyword}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
