# Deployment Instructions

## Vercel Deployment

This project consists of three main components:

1. Frontend (Next.js)
2. API (FastAPI)
3. AI Maker Space (Python package)

### Prerequisites

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

### Deployment Steps

1. Deploy the project:

```bash
vercel
```

This will:

- Deploy the Next.js frontend
- Deploy the FastAPI backend
- Set up the proper routing between components

2. After deployment, Vercel will provide you with:

- Production URL
- Preview URLs for future deployments
- Project dashboard link

### Environment Variables

Make sure to set these environment variables in your Vercel project dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key
- Any other environment variables required by your application

### Monitoring

1. Visit the Vercel dashboard to monitor:

- Build logs
- Deployment status
- Function execution
- Error logs

### Troubleshooting

If you encounter issues:

1. Check the build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure all dependencies are properly listed in package.json and requirements.txt
4. Check the Function logs for runtime errors

## Alternative: GitHub PR Route

1. Create a PR:

```bash
gh pr create --title "Deploy to Vercel" --body "Deploy latest changes to Vercel"
```

2. After PR is merged:

```bash
gh pr merge
```

Vercel will automatically deploy changes when merged to main branch.
