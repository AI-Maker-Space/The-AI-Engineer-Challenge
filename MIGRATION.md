# Migration Guide: OpenAI/Vercel to AWS Bedrock

This document describes the migration from the original OpenAI + Vercel stack to AWS Bedrock with Anthropic Claude models.

## Overview

| Aspect | Before (OpenAI/Vercel) | After (AWS Bedrock) |
|--------|------------------------|---------------------|
| AI Provider | OpenAI API | AWS Bedrock (Anthropic Claude) |
| Models | GPT-4.1-mini, GPT-4.1-nano, GPT-3.5-turbo | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku |
| Authentication | OpenAI API Key (user-provided) | AWS IAM / Profiles (server-side) |
| Frontend Framework | Next.js 15 | Vite + React 18 |
| Deployment | Vercel (serverless) | Self-hosted / Any platform |
| API Client | `openai` Python package | `boto3` (AWS SDK) |

## What Changed

### 1. Backend (`api/app.py`)

#### Before: OpenAI Implementation

```python
from openai import OpenAI

@app.post("/api/chat")
async def chat(request: ChatRequest):
    client = OpenAI(api_key=request.api_key)

    response = client.chat.completions.create(
        model=request.model,
        messages=[
            {"role": "developer", "content": request.developer_message},
            {"role": "user", "content": request.user_message}
        ],
        stream=True
    )

    async def generate():
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return StreamingResponse(generate(), media_type="text/plain")
```

#### After: AWS Bedrock Implementation

```python
import boto3
import json

@app.post("/api/chat")
async def chat(request: ChatRequest):
    client = boto3.client("bedrock-runtime", region_name=request.aws_region)

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "system": request.developer_message,
        "messages": [{"role": "user", "content": request.user_message}]
    })

    response = client.invoke_model_with_response_stream(
        modelId=request.model,
        body=body,
        contentType="application/json",
        accept="application/json"
    )

    async def generate():
        for event in response["body"]:
            chunk = json.loads(event["chunk"]["bytes"])
            if chunk["type"] == "content_block_delta":
                yield chunk["delta"]["text"]

    return StreamingResponse(generate(), media_type="text/plain")
```

#### Key Differences

| Aspect | OpenAI | AWS Bedrock |
|--------|--------|-------------|
| Client initialization | `OpenAI(api_key=...)` | `boto3.client("bedrock-runtime")` |
| Authentication | API key in request | AWS credentials (env/profile/IAM) |
| Message format | `{"role": "developer", ...}` | `{"system": ..., "messages": [...]}` |
| Streaming | `stream=True` parameter | `invoke_model_with_response_stream()` |
| Response parsing | `chunk.choices[0].delta.content` | `chunk["delta"]["text"]` |

### 2. Dependencies (`api/requirements.txt`)

#### Before
```
fastapi==0.115.12
uvicorn==0.34.2
openai==1.77.0
pydantic==2.11.4
python-multipart==0.0.18
```

#### After
```
fastapi==0.115.12
uvicorn==0.34.2
boto3>=1.35.0
pydantic==2.11.4
python-multipart==0.0.18
```

### 3. Frontend Framework

#### Before: Next.js 15

- Server-side rendering (SSR)
- App Router with `page.tsx` files
- Google Fonts via `next/font`
- Vercel-optimized deployment
- `vercel.json` configuration files

#### After: Vite + React

- Client-side rendering (CSR)
- Simple component structure
- System fonts
- Platform-agnostic deployment
- `vite.config.ts` with API proxy

### 4. Frontend Changes (`App.tsx`)

#### Before: User provides API key

```tsx
const [apiKey, setApiKey] = useState("");

// In form
<input
  type="password"
  value={apiKey}
  onChange={e => setApiKey(e.target.value)}
  placeholder="sk-..."
/>

// In request
body: JSON.stringify({
  api_key: apiKey,
  // ...
})
```

#### After: AWS Region selector (credentials handled server-side)

```tsx
const [awsRegion, setAwsRegion] = useState("us-east-1");

// In form
<select value={awsRegion} onChange={e => setAwsRegion(e.target.value)}>
  {awsRegions.map(r => <option key={r} value={r}>{r}</option>)}
</select>

// In request
body: JSON.stringify({
  aws_region: awsRegion,
  // ...
})
```

### 5. Model Selection

#### Before: OpenAI Models

```tsx
const availableModels = [
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-3.5-turbo"
];
```

#### After: Anthropic Claude Models

```tsx
const availableModels = [
  { id: "us.anthropic.claude-3-5-sonnet-20241022-v2:0", name: "Claude 3.5 Sonnet v2" },
  { id: "us.anthropic.claude-3-5-haiku-20241022-v1:0", name: "Claude 3.5 Haiku" },
  { id: "us.anthropic.claude-3-opus-20240229-v1:0", name: "Claude 3 Opus" },
  { id: "us.anthropic.claude-3-sonnet-20240229-v1:0", name: "Claude 3 Sonnet" },
  { id: "us.anthropic.claude-3-haiku-20240307-v1:0", name: "Claude 3 Haiku" },
];
```

### 6. Removed Files

The following Vercel-specific files were removed:

- `/vercel.json` - Root Vercel deployment configuration
- `/api/vercel.json` - API-specific Vercel configuration

### 7. Authentication Model

#### Before: User-Managed API Keys

- Each user provides their own OpenAI API key
- Key sent with every request
- No server-side credential management
- User responsible for key security

#### After: Server-Managed AWS Credentials

- AWS credentials configured on the server
- Uses AWS profiles, environment variables, or IAM roles
- No sensitive data sent from frontend
- Centralized credential management
- Supports enterprise SSO via AWS IAM Identity Center

## Migration Steps Summary

1. **Replace AI SDK**: `openai` → `boto3`
2. **Update API endpoint**: Rewrite chat handler for Bedrock API format
3. **Remove API key from frontend**: Replace with AWS region selector
4. **Update models list**: OpenAI models → Anthropic Claude model IDs
5. **Replace frontend framework**: Next.js → Vite (optional, but resolves SSR issues)
6. **Remove Vercel config**: Delete `vercel.json` files
7. **Configure AWS credentials**: Set up profiles or environment variables

## Benefits of Migration

| Benefit | Description |
|---------|-------------|
| Enterprise-ready auth | AWS IAM integrates with corporate identity providers |
| No API key exposure | Users don't need to manage or expose API keys |
| Cost control | AWS billing and budgets for usage tracking |
| Model variety | Access to multiple Claude model tiers |
| Regional deployment | Choose AWS regions for latency/compliance |
| Simpler frontend | Vite is lighter than Next.js for this use case |

## Considerations

- **AWS Account Required**: Users need AWS accounts with Bedrock access
- **Model Access**: Claude models must be enabled in AWS Bedrock console
- **IAM Permissions**: Server needs `bedrock:InvokeModelWithResponseStream` permission
- **Regional Availability**: Not all models available in all regions
