# PRD to Test Case Generator - Frontend

A modern React frontend for converting Product Requirements Documents (PRDs) into comprehensive test cases using AI.

## Features

- **File Upload Support**: Drag & drop or click to upload PDF, JPEG, JPG, and PNG files
- **AI-Powered Processing**: Uses Google Gemini AI to extract text and generate test cases
- **Interactive Table**: View test cases with sorting, filtering, and expandable details
- **CSV Export**: Download generated test cases as CSV for external use
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- A valid Google Gemini API key

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The frontend will automatically proxy API requests to `http://localhost:8000` (make sure the backend is running)

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it into the application

## Usage

1. **Enter API Key**: First, enter your Gemini API key in the provided field
2. **Upload PRD**: Drag & drop or click to upload your PRD file (PDF, JPEG, JPG, PNG)
3. **Processing**: Wait for AI to analyze your document and generate test cases
4. **Review Results**: View generated test cases in the interactive table
5. **Filter & Sort**: Use filters and sorting to organize test cases
6. **Expand Details**: Click the arrow buttons to see full test steps and expected results
7. **Download CSV**: Click "Download CSV" to export test cases
8. **New Upload**: Click "New Upload" to process another document

## Supported File Formats

- **PDF**: Best for documents with selectable text
- **JPEG/JPG**: Images of PRD documents
- **PNG**: Screenshots or scanned PRDs

## Tips for Best Results

- Ensure your PRD has clear, readable text
- Include functional requirements and user stories
- Higher resolution images work better for text extraction
- PDFs with selectable text provide the best results

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (not recommended)

## Technology Stack

- **React 18**: Modern React with hooks
- **Axios**: HTTP client for API requests
- **React Dropzone**: File upload with drag & drop
- **Lucide React**: Modern icon library
- **React Hot Toast**: Beautiful notifications
- **CSS3**: Modern styling with gradients and animations