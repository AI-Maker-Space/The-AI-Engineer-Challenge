<p align = "center" draggable=”false” ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto" alt=""/>
</p>


## <h1 align="center" id="heading"> 👋 Welcome to the AI Engineer Challenge</h1>

## 🤖 Your First Vibe Coding LLM Application

> New to coding? Start with our [Interactive Dev Environment for LLM Development](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers) guide. It will walk you through setting up the tools and API keys you'll need for the course.

In this repository, we'll walk you through the steps to create an LLM-powered application with a vibe-coded frontend!

Are you ready? Let's get started!


<details>
  <summary>🏗️ Forking & Cloning This Repository</summary>

Before you begin, make sure you have:

1. 👤 A GitHub account (you'll need to replace `YOUR_GITHUB_USERNAME` with your actual username)
2. 🔧 Git installed on your local machine
3. 💻 A code editor (like VS Code, Cursor, etc.)
4. ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows)
5. 🔑 A GitHub Personal Access Token (for authentication)

Got everything in place? Let's move on!

1. Fork [this](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge) repo!

     ![image](https://i.imgur.com/bhjySNh.png)

2. Clone your newly created repo.

     ``` bash
     # First, navigate to where you want the project folder to be created
     cd PATH_TO_DESIRED_PARENT_DIRECTORY

     # Then clone (this will create a new folder called The-AI-Engineer-Challenge)
     git clone git@github.com:<YOUR GITHUB USERNAME>/The-AI-Engineer-Challenge.git
     ```

     > Note: This command uses SSH. If you haven't set up SSH with GitHub, the command will fail. In that case, use HTTPS by replacing `git@github.com:` with `https://github.com/` - you'll then be prompted for your GitHub username and personal access token.

3. Verify your git setup:

     ```bash
     # Check that your remote is set up correctly
     git remote -v

     # Check the status of your repository
     git status

     # See which branch you're on
     git branch
     ```

     <!-- > Need more help with git? Check out our [Detailed Git Setup Guide](docs/GIT_SETUP.md) for a comprehensive walkthrough of git configuration and best practices. -->

4. Open the freshly cloned repository in your coding environment of choice: Cursor, VS Code, Claude Code, GitHub Copilot, or any other AI coding harness.

     ```bash
     cd The-AI-Engineer-Challenge
     ```

5. Check out the existing backend code found in `/api/index.py`, and review `AGENTS.md` for the shared AI coding assistant instructions.

</details>

<details>
  <summary>⚙️ Backend Setup with uv</summary>

1. Install the [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv`). `uv` will download and manage the Python version configured for this project. This repo currently pins Python `3.13.2` in `.python-version`, while `pyproject.toml` accepts Python `>=3.12,<3.15`.
2. From the project root, install dependencies with `uv sync`. This creates `.venv/` and fetches the configured Python version automatically if needed.
3. Copy the example environment file and choose your LLM provider:

     ```bash
     cp .env.example .env
     ```

     Then set `LLM_PROVIDER` to either `openai` or `anthropic`.

     For OpenAI, configure:

     ```dotenv
     LLM_PROVIDER="openai"
     OPENAI_API_KEY="your-openai-key"
     OPENAI_MODEL="gpt-4o-mini"
     ```

     For Anthropic, configure:

     ```dotenv
     LLM_PROVIDER="anthropic"
     ANTHROPIC_API_KEY="your-anthropic-key"
     ANTHROPIC_MODEL="claude-sonnet-4-5"
     ```

4. Start the backend directly from the project root with `uv run uvicorn api.index:app --reload`. The server will run on `http://localhost:8000` with auto-reload enabled for development.
5. Additional backend details live in `api/README.md`.

</details>

<details>
  <summary>🔥 Setting Up for Vibe Coding Success </summary>

While it is a bit counter-intuitive to set things up before jumping into vibe-coding, it is important to remember that there exists a gradient between AI-Assisted Development and Vibe-Coding. We're only reaching *slightly* into AI-Assisted Development for this challenge, but it's worth it!

1. Review `AGENTS.md` first. It is the single source of truth for AI coding assistant behavior in this repo.
2. This project supports multiple coding harnesses, including Cursor, Claude Code, GitHub Copilot in VS Code, or any other AI coding assistant/harness.
3. If your coding tool supports project rules, custom instructions, or docs indexing, point it at the shared instructions and official docs:

     ```text
     AGENTS.md
     https://nextjs.org/docs/llms.txt
     https://vercel.com/docs/llms.txt
     ```

4. Harness-specific files are included for convenience:

     ```text
     CLAUDE.md
     .github/copilot-instructions.md
     .cursor/rules/
     ```

     These should defer to `AGENTS.md`.

5. If your tool does not support docs indexing, no worries — paste the relevant docs links into your prompt when asking for frontend or deployment help.

</details>

<details>
  <summary>😎 Vibe Coding a Front End for the FastAPI Backend</summary>

1. Open your preferred AI coding assistant or coding harness.

2. If your frontend is created inside `/frontend`, make sure your Vercel project settings point to the correct frontend root directory or follow the deployment instructions generated by your coding assistant.

3. Make sure the frontend integrates with the provided FastAPI backend:

     ```text
     POST /api/chat
     GET /api/health
     ```

4. Run the frontend using the instructions your assistant provides.

> NOTE: If you run into any errors, copy and paste them back into your AI coding assistant and ask it to help you fix them.

> NOTE: You have been provided with a backend in the `/api` folder — please ensure your frontend integrates with it!

</details>

<details>
  <summary>🚀 Deploying Your First LLM-powered Application with Vercel</summary>

1. Ensure you have signed in to [Vercel](https://vercel.com/) with your GitHub account.

2. Ensure you have `npm` (this may have been installed if you followed the instructions from setting up your IDE from LLM development linked at the beginning of this step-by-step guide.) - if you need help with that, ask your favorite coding assistant!

3. Run the command:

     ```bash
     npm install -g vercel
     ```

4. Run the command:

     ```bash
     vercel
     ```

5. Follow the in-terminal instructions. (Below is an example of what you will see!)

     ![image](https://i.imgur.com/D1iKGCq.png)

6. Once the build is completed – head to the provided link and try out your app!

> NOTE: Remember, if you run into any errors, ask your AI coding assistant to help you fix them!

### Vercel Link to Share

You'll want to make sure you share your *domain* hyperlink to ensure people can access your app!

![image](https://i.imgur.com/mpXIgIz.png)

> NOTE: Test this is the public link by trying to open your newly deployed site in an Incognito browser tab!
---

## 📦 Submission Instructions

1. 🏗️ Build: Commit and push your changes to your remote on GitHub
2. 🚢 Ship: Deploy your app to Vercel
3. 🚀 Share: Submit your completed challenge through the [Typeform submission link](https://maven.com/aimakerspace/admin/courses/ai-eng-bootcamp/syllabus/modules/TYPEFORM_LINK).

</details>

### 🎉 Congratulations! 

You just 🏗️ built, 🚢 shipped, and 🚀 shared your first LLM-powered application! 🚀🚀🚀 

**But why stop there?**

Get on LinkedIn and post your results and experience! Make sure to tag us at @AIMakerspace!

Here's a template to get your post started!

```
🚀🎉 Exciting News! 🎉🚀

🏗️ Today, I'm thrilled to announce that I've successfully built and shipped my first-ever LLM-powered app using a FastAPI backend, a vibe-coded frontend, and an LLM provider like OpenAI or Anthropic! 🖥️

Check it out 👇
[LINK TO APP]

A big shoutout to @AI Makerspace for making this possible. Couldn't have done it without the incredible community there. 🤗🙏

Looking forward to building with the community! 🙌✨ Here's to many more creations ahead! 🥂🎉

Who else is diving into the world of AI? Let's connect! 🌐💡

#FirstLLMApp 
```
