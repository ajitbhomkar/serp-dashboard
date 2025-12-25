# SERP Keyword Ranking Dashboard

A comprehensive dashboard for tracking your website's keyword rankings in search engine results pages (SERP). Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- 📊 **Real-time Keyword Tracking**: Monitor multiple keywords and their SERP positions
- 📈 **Visual Analytics**: Interactive charts showing ranking trends over time
- 🔄 **Automated Checks**: GitHub Actions integration for daily automated rank checking
- 🚀 **Vercel Deployment**: One-click deployment to Vercel
- 🎨 **Modern UI**: Responsive design with Tailwind CSS and dark mode support
- 💾 **PostgreSQL Database**: Persistent storage of ranking history using Prisma ORM

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Google Custom Search API credentials
- Vercel account (for deployment)
- GitHub account (for automated checks)

## Setup Instructions

### 1. Clone and Install

```bash
cd dashboard
npm install
```

### 2. Database Setup

Create a PostgreSQL database and update the connection string:

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/serp_dashboard?schema=public"
```

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### 3. Google Custom Search API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Custom Search JSON API**
4. Create API credentials (API Key)
5. Set up a [Programmable Search Engine](https://programmablesearchengine.google.com/)
6. Add your credentials to `.env`:

```bash
GOOGLE_API_KEY="your_google_api_key_here"
GOOGLE_SEARCH_ENGINE_ID="your_search_engine_id_here"
```

### 4. Generate Cron Secret

For securing the ranking check endpoint:

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
CRON_SECRET="your_generated_secret_here"
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `GOOGLE_API_KEY`
   - `GOOGLE_SEARCH_ENGINE_ID`
   - `CRON_SECRET`
5. Click "Deploy"

### 3. Setup GitHub Actions

Add secrets to your GitHub repository:

1. Go to your repo → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VERCEL_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `CRON_SECRET`: Same secret from your `.env` file

The workflow will run automatically every day at 6:00 AM UTC, or you can trigger it manually from the Actions tab.

## Usage

### Adding Keywords

1. Navigate to the dashboard
2. Use the "Add New Keyword" form in the left sidebar
3. Enter the keyword you want to track
4. Enter the target URL you want to monitor
5. Click "Add Keyword"

### Checking Rankings

- **Manual Check**: Click the "Check Rankings Now" button in the navigation bar
- **Automatic Checks**: Rankings are checked daily via GitHub Actions

### Viewing Analytics

- The main dashboard shows ranking trends over time
- Click on keyword chips to toggle them on/off in the chart
- View latest positions in the keyword list

## API Endpoints

### `GET /api/keywords`
Fetch all tracked keywords with their latest rankings.

### `POST /api/keywords`
Add a new keyword to track.
```json
{
  "keyword": "next.js tutorial",
  "targetUrl": "https://yourwebsite.com/page"
}
```

### `DELETE /api/keywords?id={id}`
Delete a keyword by ID.

### `GET /api/rankings`
Fetch ranking history for all keywords.

### `GET /api/check-rankings`
Trigger a ranking check for all keywords (requires Authorization header with CRON_SECRET).

## Database Schema

```prisma
model Keyword {
  id        String   @id @default(cuid())
  keyword   String   @unique
  targetUrl String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  rankings  Ranking[]
}

model Ranking {
  id         String   @id @default(cuid())
  keywordId  String
  keyword    Keyword  @relation(fields: [keywordId], references: [id])
  position   Int
  url        String
  title      String?
  snippet    String?
  checkedAt  DateTime @default(now())
}
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: Google Custom Search JSON API
- **Deployment**: Vercel
- **Automation**: GitHub Actions

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings if using remote database

### API Rate Limits
- Google Custom Search has a quota (100 queries/day on free tier)
- Consider upgrading or using alternative SERP APIs

### Rankings Not Updating
- Check GitHub Actions logs for errors
- Verify `CRON_SECRET` matches between Vercel and GitHub
- Ensure Vercel deployment is successful

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open an issue on GitHub.
