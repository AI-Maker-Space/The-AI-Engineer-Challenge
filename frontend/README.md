# AI Engineer Challenge Frontend

A modern, responsive chat interface built with Next.js and Tailwind CSS that integrates with the FastAPI backend.

## Features

- 🤖 **Real-time Chat Interface**: Stream responses from OpenAI GPT-4.1-mini
- 🔐 **Secure API Key Management**: Local storage with password input fields
- ⚙️ **Customizable System Messages**: Configure the AI's behavior
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Dark theme with smooth animations
- ⚡ **Streaming Responses**: Real-time message streaming for better UX

## Prerequisites

- Node.js 18+ and npm
- The FastAPI backend running on `http://localhost:8000`
- An OpenAI API key

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Enter your OpenAI API key:**
   - Click the "API Key" button in the header
   - Enter your OpenAI API key (starts with "sk-")
   - The key is stored locally in your browser

5. **Start chatting:**
   - Type a message in the input field
   - Press Enter to send (Shift+Enter for new line)
   - Watch the AI respond in real-time!

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory to customize the API URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### System Message

You can customize the AI's behavior by modifying the "System Message" in the settings panel. This message sets the context for how the AI should respond.

### Model Selection

Choose from different OpenAI models:
- GPT-4.1-mini (default)
- GPT-4
- GPT-3.5 Turbo

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main chat interface
├── components/
│   ├── ChatMessage.tsx      # Individual message component
│   ├── ApiKeyModal.tsx      # API key input modal
│   └── index.ts             # Component exports
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This frontend is designed to work with Vercel. To deploy:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

3. **Set environment variables:**
   - `NEXT_PUBLIC_API_BASE_URL`: Your deployed backend URL

## Troubleshooting

### Common Issues

1. **"Failed to fetch" error:**
   - Ensure the FastAPI backend is running on `http://localhost:8000`
   - Check that CORS is properly configured in the backend

2. **API key not working:**
   - Verify your OpenAI API key is correct
   - Ensure you have sufficient credits in your OpenAI account

3. **Messages not streaming:**
   - Check the browser's network tab for errors
   - Verify the backend is returning streaming responses

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the console for any JavaScript errors
- The API key is stored in `localStorage` - you can clear it to reset

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the AI Engineer Challenge.