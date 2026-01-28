# Anthropic Chat - AWS Bedrock

A full-stack chat application powered by **Anthropic Claude models** on **AWS Bedrock**, built with Python/FastAPI backend and React/Vite frontend.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.13, FastAPI, Uvicorn |
| Frontend | React 18, TypeScript, Vite |
| AI Provider | AWS Bedrock (Anthropic Claude) |
| Authentication | AWS IAM / AWS Profiles |

## Prerequisites

- Python 3.11+ (3.13 recommended)
- Node.js 18+
- AWS CLI configured with appropriate credentials
- Access to AWS Bedrock with Anthropic Claude models enabled

## AWS Configuration

### Option 1: AWS Profile (Recommended)

Set up your AWS profile in `~/.aws/credentials` and `~/.aws/config`, then run the backend with:

```bash
AWS_PROFILE=your-profile-name uvicorn app:app --reload --port 8000
```

### Option 2: Environment Variables

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### Option 3: IAM Role

When running on AWS infrastructure (EC2, ECS, Lambda), use IAM roles for automatic credential management.

### Enabling Claude Models in Bedrock

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock)
2. Navigate to **Model access** in the left sidebar
3. Click **Manage model access**
4. Enable the Anthropic Claude models you need
5. Wait for access to be granted (usually immediate)

## Installation

### Backend Setup

```bash
cd api

# Using uv (recommended)
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt

# Or using pip
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend

```bash
cd api
source .venv/bin/activate
AWS_PROFILE=your-aws-profile uvicorn app:app --reload --port 8000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000

## API Endpoints

### POST /api/chat

Stream a chat response from Claude.

**Request Body:**
```json
{
  "developer_message": "You are a helpful assistant",
  "user_message": "Hello, how are you?",
  "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  "aws_region": "us-east-1"
}
```

**Response:** Server-Sent Events (SSE) stream of text chunks

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Available Models

| Model ID | Display Name | Description |
|----------|--------------|-------------|
| `us.anthropic.claude-3-5-sonnet-20241022-v2:0` | Claude 3.5 Sonnet v2 | Latest, most capable |
| `us.anthropic.claude-3-5-haiku-20241022-v1:0` | Claude 3.5 Haiku | Fast and efficient |
| `us.anthropic.claude-3-opus-20240229-v1:0` | Claude 3 Opus | Most powerful reasoning |
| `us.anthropic.claude-3-sonnet-20240229-v1:0` | Claude 3 Sonnet | Balanced performance |
| `us.anthropic.claude-3-haiku-20240307-v1:0` | Claude 3 Haiku | Fastest responses |

## Supported AWS Regions

- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-northeast-1` (Tokyo)

> Note: Model availability varies by region. Check the [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) for current availability.

## Project Structure

```
The-AI-Engineer-Challenge/
├── api/
│   ├── app.py              # FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── vite.config.ts      # Vite configuration with API proxy
│   └── package.json        # Node.js dependencies
├── README.md               # This file
└── MIGRATION.md            # Migration guide from OpenAI/Vercel
```

## Troubleshooting

### "Unable to locate credentials"

Ensure your AWS credentials are properly configured:
```bash
aws sts get-caller-identity --profile your-profile-name
```

### "Access denied" for Bedrock models

1. Verify you have enabled the model in AWS Bedrock console
2. Check your IAM permissions include `bedrock:InvokeModelWithResponseStream`

### Frontend can't connect to backend

Ensure the backend is running on port 8000. The Vite dev server proxies `/api/*` requests to `http://localhost:8000`.

## License

MIT
