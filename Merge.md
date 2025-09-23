# Deployment Instructions

This project consists of two separate deployments:

1. Frontend (Next.js)
2. API (FastAPI)

## API Deployment

### Prerequisites

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

### Deploy API

1. Navigate to the API directory:

```bash
cd api
```

2. Deploy to Vercel:

```bash
vercel
```

3. After deployment, copy the API URL (you'll need it for the frontend)

### Environment Variables for API

Set these in your Vercel project dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key

## Frontend Deployment

### Prerequisites

Same as API deployment (Vercel CLI and login)

### Deploy Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Deploy to Vercel:

```bash
vercel
```

### Environment Variables for Frontend

Set these in your Vercel project dashboard:

- `NEXT_PUBLIC_API_URL`: The URL of your deployed API (e.g., https://your-api.vercel.app)

## Monitoring and Management

### API Project

1. Monitor API logs and performance in Vercel dashboard
2. Check Function execution logs
3. Monitor API rate limits and usage

### Frontend Project

1. Monitor build logs and deployment status
2. Check static asset delivery
3. Monitor page performance

## Troubleshooting

### API Issues

1. Check API logs in Vercel dashboard
2. Verify environment variables are set
3. Test API endpoints directly

### Frontend Issues

1. Check build logs
2. Verify API URL is correctly set
3. Check browser console for errors
4. Verify API is accessible from frontend domain

## Alternative: GitHub PR Route

1. For API changes:

```bash
cd api
gh pr create --title "Deploy API changes" --body "Deploy latest API changes to Vercel"
```

2. For Frontend changes:

```bash
cd frontend
gh pr create --title "Deploy Frontend changes" --body "Deploy latest Frontend changes to Vercel"
```

3. After PRs are merged:

```bash
gh pr merge
```

Vercel will automatically deploy changes when merged to main branch for each project.
