

# PRD to Test Case Generator

🚀 An AI-powered application that transforms Product Requirements Documents (PRDs) into comprehensive test cases using Google Gemini AI.

## 🌐 **Live Demo**

**Try it now:** https://the-ai-engineering-challenge-r620lovcb.vercel.app

✨ **No setup required** - just upload your PRD and get instant test cases!

## ✨ Features

- **📄 Multi-format Support**: Upload PRDs in PDF, JPEG, JPG, or PNG formats
- **🤖 AI-Powered Analysis**: Uses Google Gemini AI to extract content and generate test cases
- **📊 Interactive Results**: View test cases in a beautiful, sortable, and filterable table
- **📁 CSV Export**: Download generated test cases as CSV files
- **🎨 Modern UI**: Clean, responsive design with drag & drop functionality
- **🆓 Free to Use**: 5 free uses per day, no API key required!
- **🔐 Secure**: API keys are handled securely on the backend

## 🏗️ Architecture

- **Backend**: FastAPI (Python) with Google Gemini AI integration
- **Frontend**: React with modern UI components
- **File Processing**: PDF text extraction and image text recognition
- **AI Integration**: Google Gemini 1.5 Flash for fast content analysis and test case generation
- **Deployment**: Optimized for Vercel with lightweight dependencies

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- For development: Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your API key (for development):
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. Start the backend server:
   ```bash
   python3 app.py
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📖 Usage

### 🌐 Using the Live App

1. **Visit**: https://the-ai-engineering-challenge-r620lovcb.vercel.app
2. **Upload PRD**: Drag & drop or click to upload your PRD file (PDF, JPEG, JPG, PNG)
3. **AI Processing**: Wait for the AI to analyze your document and generate test cases
4. **Review & Export**: View the generated test cases and download as CSV if needed

### 🔄 Free Tier Limits

- **5 free uses per day** per user
- Resets daily at midnight
- No sign-up or API key required
- Perfect for trying out the service!

## 📁 Project Structure

```
The-AI-Engineer-Challenge/
├── api/                          # Backend FastAPI application
│   ├── app.py                   # Main API application
│   ├── requirements.txt         # Python dependencies (optimized)
│   ├── .env                     # Environment variables (development)
│   └── README.md               # Backend documentation
├── frontend/                    # React frontend application
│   ├── public/                 # Static files
│   ├── src/                    # React source code
│   │   ├── components/         # React components
│   │   │   ├── Header.js       # App header
│   │   │   ├── FileUpload.js   # File upload component
│   │   │   ├── TestCaseTable.js # Results table
│   │   │   └── UsageInfo.js    # Free tier usage display
│   │   ├── App.js              # Main App component
│   │   └── index.js            # React entry point
│   ├── package.json            # Node.js dependencies
│   └── README.md              # Frontend documentation
├── vercel.json                  # Vercel deployment configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔧 API Endpoints

### `POST /api/upload-prd`
Upload a PRD file and generate test cases.

**Request:**
- `file`: Uploaded file (PDF, JPEG, JPG, PNG)

**Response:**
```json
{
  "success": true,
  "message": "Successfully generated 15 test cases",
  "test_cases": [
    {
      "test_case_id": "TC001",
      "feature": "User Authentication",
      "scenario": "User login with valid credentials",
      "test_steps": "1. Navigate to login page\n2. Enter valid email\n3. Enter valid password\n4. Click login button",
      "expected_result": "User is successfully logged in and redirected to dashboard",
      "priority": "High",
      "category": "Functional"
    }
  ],
  "usage_info": {
    "remaining_today": 4,
    "daily_limit": 5,
    "used_today": 1
  }
}
```

### `POST /api/download-csv`
Download test cases as CSV file.

**Request:** Array of test case objects

**Response:** CSV file download

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "PRD to Test Case Generator",
  "free_tier_available": true,
  "daily_free_limit": 5
}
```

### `GET /api/usage-info`
Get current usage information for free tier.

**Response:**
```json
{
  "service_available": true,
  "free_tier_available": true,
  "tier": "free",
  "daily_limit": 5,
  "used_today": 2,
  "remaining_today": 3,
  "can_use": true
}
```

## 🧪 Test Case Categories

The AI generates test cases across multiple categories:

- **Functional**: Core feature functionality
- **UI/UX**: User interface and experience
- **Performance**: Speed and efficiency tests
- **Security**: Security and data protection
- **Integration**: System integration tests
- **Edge Case**: Boundary and error conditions

## 📊 Test Case Priorities

- **High**: Critical functionality that must work
- **Medium**: Important features with moderate impact
- **Low**: Nice-to-have features or edge cases

## 🚀 Deployment Optimizations

This application is optimized for production deployment:

- **Lightweight Backend**: Removed pandas dependency (~100MB saved)
- **CSV Generation**: Uses built-in Python csv module instead of pandas
- **Fast AI Model**: Uses Gemini 1.5 Flash for better rate limits
- **React Optimization**: Proper static build configuration for Vercel
- **Environment Security**: API keys secured via environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [FAQ and Common Issues](FAQandCommonIssues.md)
2. Review the individual README files in `/api` and `/frontend` directories
3. Open an issue on GitHub

## 🙏 Acknowledgments

- Google Gemini AI for powerful text analysis capabilities
- FastAPI for the robust backend framework
- React community for excellent frontend tools and libraries
- Vercel for seamless deployment platform

---
