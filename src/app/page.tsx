import Link from 'next/link';
import KeywordRankingChart from '@/components/KeywordRankingChart';
import KeywordList from '@/components/KeywordList';
import AddKeywordForm from '@/components/AddKeywordForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SERP Ranking Dashboard
            </h1>
            <Link
              href="/api/check-rankings"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Check Rankings Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Keyword Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add New Keyword
              </h2>
              <AddKeywordForm />
            </div>

            {/* Keyword List */}
            <div className="mt-8">
              <KeywordList />
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Ranking Trends
              </h2>
              <KeywordRankingChart />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Keywords
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  --
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Position
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  --
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  --
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
