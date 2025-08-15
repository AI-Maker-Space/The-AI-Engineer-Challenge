# AI Engineer Challenge Frontend

A modern, responsive React frontend for the AI Engineer Challenge Chat API. This frontend provides an intuitive interface for interacting with OpenAI's GPT models through the backend API.

## Features

- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations
- 🔐 **Secure API Key Management**: Local storage of API keys with password masking
- 🤖 **Multiple Model Support**: Choose from various GPT models (GPT-4, GPT-3.5, etc.)
- ⚙️ **Customizable Behavior**: Set developer messages to control AI behavior
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🚀 **Real-time Streaming**: Live streaming of AI responses
- 🎯 **TypeScript**: Full type safety and better development experience

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API running (see backend README for setup)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd /Users/Santu/AIMKRSPA/code/The-AI-Engineer-Challenge/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. **Start the Backend First**:
   ```bash
   cd /Users/Santu/AIMKRSPA/code/The-AI-Engineer-Challenge/api
   pip install -r requirements.txt
   python app.py
   ```
   The backend will run on `http://localhost:8000`

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd /Users/Santu/AIMKRSPA/code/The-AI-Engineer-Challenge/frontend
   npm start
   ```
   The frontend will open in your browser at `http://localhost:3000`

## Usage

1. **Enter Your OpenAI API Key**:
   - Click on "Configuration" to expand the settings
   - Enter your OpenAI API key (starts with `sk-`)
   - The key is stored locally and never sent to our servers

2. **Choose a Model**:
   - Select from available GPT models (default: gpt-4.1-mini)
   - Different models have different capabilities and pricing

3. **Customize AI Behavior** (Optional):
   - Set a developer message to define the AI's role and context
   - Example: "You are a helpful coding assistant specializing in Python"

4. **Start Chatting**:
   - Type your message in the input field
   - Press Enter to send (Shift+Enter for new lines)
   - Watch the AI respond in real-time

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat component
│   │   ├── ChatInterface.css
│   │   ├── ChatMessage.tsx        # Individual message display
│   │   ├── ChatMessage.css
│   │   ├── ApiKeyInput.tsx        # Configuration panel
│   │   └── ApiKeyInput.css
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Main application styles
│   ├── index.tsx                  # Application entry point
│   └── index.css                  # Base styles
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## Configuration

The frontend is configured to proxy API requests to the backend at `http://localhost:8000`. This is set in the `package.json` file:

```json
{
  "proxy": "http://localhost:8000"
}
```

## Available Scripts

- `npm start`: Start the development server
- `npm build`: Build the production version
- `npm test`: Run tests
- `npm eject`: Eject from Create React App (not recommended)

## API Integration

The frontend integrates with the backend API endpoints:

- `POST /api/chat`: Send chat messages and receive streaming responses
- `GET /api/health`: Health check endpoint

## Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Smooth transitions and animations
- Mobile-first responsive design
- Glassmorphism effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Backend Connection Error**:
   - Ensure the backend is running on port 8000
   - Check that CORS is properly configured

2. **API Key Issues**:
   - Verify your OpenAI API key is valid
   - Check that you have sufficient credits in your OpenAI account

3. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the console for any JavaScript errors
- The proxy configuration automatically forwards API calls to the backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the AI Engineer Challenge and follows the same licensing terms.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the backend API documentation
3. Check the browser console for error messages
4. Verify your OpenAI API key and account status