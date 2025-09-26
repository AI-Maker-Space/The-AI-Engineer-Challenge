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

---

## Merging Feature Branch back to main

This repo prefers branch-based development. When you're ready to merge:

### Option A: GitHub Pull Request (recommended)

1. Push your branch:
```bash
git push -u origin <your-branch>
```
2. Open a PR on GitHub from `<your-branch>` into `main`.
3. Request review, wait for checks, and merge via the UI.

### Option B: GitHub CLI

1. Create the PR:
```bash
gh pr create --base main --head <your-branch> \
  --title "<feature>: description" \
  --body "Implements <feature>. Includes tests/docs."
```
2. Merge when approved:
```bash
gh pr merge --squash --delete-branch
```

### After Merge

- Pull latest main locally:
```bash
git checkout main && git pull
```
- Vercel will redeploy if connected.
