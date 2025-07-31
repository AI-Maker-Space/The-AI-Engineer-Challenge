# Environment Setup Guide

## Hybrid API Key Setup (Free Tier + User API Keys)

The app now supports a hybrid approach where you can provide a built-in API key for free tier usage while still allowing users to input their own keys for unlimited access.

### Option 1: Set Built-in API Key (Recommended)

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Set the environment variable:
   ```bash
   export GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Or create a `.env` file in the project root:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### What this enables:

- ✅ **Free Tier**: Users get 5 free uses per day without needing their own API key
- ✅ **Unlimited Tier**: Users can still input their own API key for unlimited usage
- ✅ **Rate Limiting**: Built-in daily limits per user (IP + User Agent based)
- ✅ **Cost Control**: You control the free tier usage

### Option 2: API Key Required Mode

If you don't set `GEMINI_API_KEY`, the app will require users to input their own API keys.

### Rate Limiting

- Default: 5 free uses per day per user
- Tracking: Based on IP address + User Agent hash
- Storage: In-memory (for production, consider Redis/Database)

### Production Considerations

For production deployment:
1. Use a proper database or Redis for usage tracking
2. Consider implementing user authentication for better rate limiting
3. Add monitoring for API usage costs
4. Set up proper logging for usage analytics

### Usage Tracking

The app tracks usage per unique client (IP + User Agent) with daily resets. Each successful test case generation counts as one use.

### API Endpoints

- `GET /api/usage-info` - Get current usage status
- `POST /api/upload-prd` - Upload PRD (with optional user_api_key)
- `GET /api/health` - Health check with free tier status 