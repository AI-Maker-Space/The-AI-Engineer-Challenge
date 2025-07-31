<p align = "center" draggable="false" ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>


## <h1 align="center" id="heading"> 👋 Welcome to the AI Engineer Challenge</h1>

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

## 🤖 Your First Vibe Coding LLM Application

> If you are a novice, and need a bit more help to get your dev environment off the ground, check out this [Setup Guide](docs/GIT_SETUP.md). This guide will walk you through the 'git' setup you need to get started.

> For additional context on LLM development environments and API key setup, you can also check out our [Interactive Dev Environment for LLM Development](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers).

In this repository, we'll walk you through the steps to create a LLM (Large Language Model) powered application with a vibe-coded frontend!

Are you ready? Let's get started!

<details>
  <summary>🖥️ Accessing "gpt-4.1-mini" (ChatGPT) like a developer</summary>

1. Head to [this notebook](https://colab.research.google.com/drive/1sT7rzY_Lb1_wS0ELI1JJfff0NUEcSD72?usp=sharing) and follow along with the instructions!

2. Complete the notebook and try out your own system/assistant messages!

That's it! Head to the next step and start building your application!

</details>


<details>
  <summary>🏗️ Forking & Cloning This Repository</summary>

Before you begin, make sure you have:

1. 👤 A GitHub account (you'll need to replace `YOUR_GITHUB_USERNAME` with your actual username)
2. 🔧 Git installed on your local machine
3. 💻 A code editor (like Cursor, VS Code, etc.)
4. ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows)
5. 🔑 A GitHub Personal Access Token (for authentication)

Got everything in place? Let's move on!

1. Fork [this](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge) repo!

     ![image](https://i.imgur.com/bhjySNh.png)

1. Clone your newly created repo.

     ``` bash
     # First, navigate to where you want the project folder to be created
     cd PATH_TO_DESIRED_PARENT_DIRECTORY

     # Then clone (this will create a new folder called The-AI-Engineer-Challenge)
     git clone git@github.com:<YOUR GITHUB USERNAME>/The-AI-Engineer-Challenge.git
     ```

     > Note: This command uses SSH. If you haven't set up SSH with GitHub, the command will fail. In that case, use HTTPS by replacing `git@github.com:` with `https://github.com/` - you'll then be prompted for your GitHub username and personal access token.

2. Verify your git setup:

     ```bash
     # Check that your remote is set up correctly
     git remote -v

     # Check the status of your repository
     git status

     # See which branch you're on
     git branch
     ```

     <!-- > Need more help with git? Check out our [Detailed Git Setup Guide](docs/GIT_SETUP.md) for a comprehensive walkthrough of git configuration and best practices. -->

3. Open the freshly cloned repository inside Cursor!

     ```bash
     cd The-AI-Engineering-Challenge
     cursor .
     ```

4. Check out the existing backend code found in `/api/app.py`

</details>

<details>
  <summary>🔥Setting Up for Vibe Coding Success </summary>

While it is a bit counter-intuitive to set things up before jumping into vibe-coding - it's important to remember that there exists a gradient betweeen AI-Assisted Development and Vibe-Coding. We're only reaching *slightly* into AI-Assisted Development for this challenge, but it's worth it!

1. Check out the rules in `.cursor/rules/` and add theme-ing information like colour schemes in `frontend-rule.mdc`! You can be as expressive as you'd like in these rules!
2. We're going to index some docs to make our application more likely to succeed. To do this - we're going to start with `CTRL+SHIFT+P` (or `CMD+SHIFT+P` on Mac) and we're going to type "custom doc" into the search bar. 

     ![image](https://i.imgur.com/ILx3hZu.png)
3. We're then going to copy and paste `https://nextjs.org/docs` into the prompt.

     ![image](https://i.imgur.com/psBjpQd.png)

4. We're then going to use the default configs to add these docs to our available and indexed documents.

     ![image](https://i.imgur.com/LULLeaF.png)

5. After that - you will do the same with Vercel's documentation. After which you should see:

     ![image](https://i.imgur.com/hjyXhhC.png) 

</details>

<details>
  <summary>😎 Vibe Coding a Front End for the FastAPI Backend</summary>

1. Use `Command-L` or `CTRL-L` to open the Cursor chat console. 

2. Set the chat settings to the following:

     ![image](https://i.imgur.com/LSgRSgF.png)

3. Ask Cursor to create a frontend for your application. Iterate as much as you like!

4. Run the frontend using the instructions Cursor provided. 

> NOTE: If you run into any errors, copy and paste them back into the Cursor chat window - and ask Cursor to fix them!

> NOTE: You have been provided with a backend in the `/api` folder - please ensure your Front End integrates with it!

</details>

<details>
  <summary>🚀 Deploying Your First LLM-powered Application with Vercel</summary>

1. Ensure you have signed into [Vercel](https://vercel.com/) with your GitHub account.

2. Ensure you have `npm` (this may have been installed in the previous vibe-coding step!) - if you need help with that, ask Cursor!

3. Run the command:

     ```bash
     npm install -g vercel
     ```

4. Run the command:

     ```bash
     vercel --prod
     ```

5. Follow the in-terminal instructions. (Below is an example of what you will see!)

     ![image](https://i.imgur.com/D1iKGCq.png)

6. Once the build is completed - head to the provided link and try out your app!

> NOTE: Remember, if you run into any errors - ask Cursor to help you fix them!

</details>

### Vercel Link to Share

You'll want to make sure you share you *domains* hyperlink to ensure people can access your app!

![image](https://i.imgur.com/mpXIgIz.png)

> NOTE: Test this is the public link by trying to open your newly deployed site in an Incognito browser tab!

### 🎉 Congratulations! 

You just deployed your first LLM-powered application! 🚀🚀🚀 Get on linkedin and post your results and experience! Make sure to tag us at @AIMakerspace!

Here's a template to get your post started!

```
🚀🎉 Exciting News! 🎉🚀

🏗️ Today, I'm thrilled to announce that I've successfully built and shipped my first-ever LLM-powered app using FastAPI, React, and the Google Gemini API! 🖥️

✨ My PRD to Test Case Generator transforms Product Requirements Documents into comprehensive test cases using AI - and it's live and free to use!

Check it out 👇
https://the-ai-engineering-challenge-r620lovcb.vercel.app

🎯 Features:
- Multi-format support (PDF, images)
- AI-powered test case generation
- Beautiful interactive results
- CSV export functionality
- 5 free uses per day!

A big shoutout to the @AI Makerspace for making this possible. Couldn't have done it without the incredible community there. 🤗🙏

Looking forward to building more with the community! 🙌✨ Here's to many more AI creations ahead! 🥂🎉

Who else is diving into the world of AI? Let's connect! 🌐💡

#FirstLLMApp #AI #MachineLearning #WebDevelopment #TestAutomation
```
