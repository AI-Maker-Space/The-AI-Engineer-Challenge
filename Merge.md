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

## Merging this Feature Branch back to main

This repo prefers branch development. You are currently on `feature/pdf-topics-extraction`.

### Option 1: GitHub Pull Request (Web UI)

1. Push your branch if you haven't already:

```bash
git push -u origin feature/pdf-topics-extraction
```

2. Open a Pull Request targeting `main` on GitHub.
   - Title: "feat(api): PDF topics extraction"
   - Description: Summarize the API change: add per-chunk topic extraction, return `topics` from `/api/upload-pdf`.

3. Request review and address any comments.

4. Merge the PR using "Squash and merge" or your team's preferred strategy.

5. (Optional) Delete the remote branch from the PR page after merge.

### Option 2: GitHub CLI

1. Ensure your branch is pushed:

```bash
git push -u origin feature/pdf-topics-extraction
```

2. Create the PR:

```bash
gh pr create \
  --base main \
  --head feature/pdf-topics-extraction \
  --title "feat(api): PDF topics extraction" \
  --body "Add per-chunk topic extraction to /api/upload-pdf, return unique topics."
```

3. Merge the PR (after checks pass and reviews complete):

```bash
gh pr merge --merge   # or --squash / --rebase, per your policy
```

4. (Optional) Delete the local and remote branch:

```bash
git branch -d feature/pdf-topics-extraction
git push origin --delete feature/pdf-topics-extraction
```
