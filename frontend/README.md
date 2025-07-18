# AI Engineer Challenge - Frontend

A modern, beautiful chat interface for the AI Engineer Challenge, built with Next.js and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Real-time Streaming**: Live streaming responses from the AI
- **Secure API Key Input**: Password-style input for OpenAI API keys
- **Customizable System Messages**: Configure the AI's behavior
- **Chat History**: View conversation history with timestamps
- **Error Handling**: Clear error messages and validation
- **Mobile Responsive**: Works perfectly on all device sizes

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **FastAPI Backend**: Integration with the provided Python backend

## 📋 Prerequisites

- Node.js 18.17.0 or higher (recommended)
- npm or yarn package manager
- OpenAI API key
- Running FastAPI backend (see `/api` directory)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Start the Backend

In a separate terminal, start the FastAPI backend:

```bash
cd api
pip install -r requirements.txt
python app.py
```

The backend will be available at `http://localhost:8000`

## 🎯 How to Use

1. **Configure Settings**: Click the settings icon (⚙️) in the top-right corner
2. **Enter API Key**: Add your OpenAI API key in the password field
3. **Customize System Message**: Modify the default system message if desired
4. **Start Chatting**: Type your message and press Enter or click Send
5. **Enjoy**: Watch the AI respond in real-time with streaming text!

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory for production settings:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Integration

The frontend is configured to proxy API requests to the FastAPI backend running on `localhost:8000`. This is handled by the `next.config.js` file.

## 📱 Features in Detail

### Chat Interface
- **Message Bubbles**: User messages appear on the right (blue), AI responses on the left (gray)
- **Real-time Streaming**: AI responses appear character by character as they're generated
- **Loading States**: Animated dots show when the AI is thinking
- **Auto-scroll**: Chat automatically scrolls to the latest message

### Settings Panel
- **API Key Management**: Secure password input for OpenAI API key
- **System Message**: Customize the AI's behavior and personality
- **Collapsible**: Toggle settings panel on/off

### Error Handling
- **Validation**: Ensures API key and message are provided
- **Network Errors**: Clear error messages for connection issues
- **API Errors**: Displays backend error messages

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#0ea5e9` to `#7c3aed`)
- **Background**: Subtle blue gradient
- **Text**: High contrast gray scale
- **Success**: Green accents
- **Error**: Red accents

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: Regular, Medium, Semibold, Bold
- **Sizes**: Responsive text scaling

### Animations
- **Fade In**: Smooth opacity transitions
- **Slide Up**: Settings panel animations
- **Bounce**: Loading indicators
- **Hover**: Interactive element feedback

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings
4. Update the API URL in production

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Run `npm install` to install dependencies
2. **Backend connection errors**: Ensure the FastAPI server is running on port 8000
3. **API key errors**: Verify your OpenAI API key is valid and has sufficient credits
4. **Build errors**: Check Node.js version (requires 18.17.0+)

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the browser console for JavaScript errors
- Verify the backend health endpoint at `http://localhost:8000/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the AI Engineer Challenge. See the main repository for license information.

## 🙏 Acknowledgments

- Built with Next.js and Tailwind CSS
- Icons from Lucide React
- Backend integration with FastAPI
- OpenAI API for AI capabilities