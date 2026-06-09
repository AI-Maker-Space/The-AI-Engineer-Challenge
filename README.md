<p align = "center" draggable=”false” ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>


## <h1 align="center" id="heading"> 👋 Welcome to the AI Engineer Challenge</h1>

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

4. Check out the existing backend code found in `/api/index.py`

</details>

<details>
  <summary>⚙️ Backend Setup with uv</summary>

1. Install the [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv`). `uv` will download and manage Python 3.12 for you the first time you run a project command.
2. From the project root, install dependencies with `uv sync`. This creates `.venv/` (and fetches Python 3.12 automatically if needed).
3. Set your OpenAI API key in the shell before running the server, for example `export OPENAI_API_KEY=sk-...`.
4. Start the backend directly from the project root with `uv run uvicorn api.index:app --reload`. The server will run on `http://localhost:8000` with auto-reload enabled for development.
5. Additional backend details live in `api/README.md`.

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
     vercel
     ```

5. Follow the in-terminal instructions. (Below is an example of what you will see!)

     ![image](https://i.imgur.com/D1iKGCq.png)

6. Once the build is completed - head to the provided link and try out your app!

> NOTE: Remember, if you run into any errors - ask Cursor to help you fix them!

### Vercel Link to Share

You'll want to make sure you share you *domains* hyperlink to ensure people can access your app!

![image](https://i.imgur.com/mpXIgIz.png)

> NOTE: Test this is the public link by trying to open your newly deployed site in an Incognito browser tab!

</details>

<details>
     <summary>🧪 Vibe Check Your LLM App</summary>

### 🤔 What is a Vibe Check?

Now that you’ve built and deployed your first LLM-powered application, it’s time to evaluate it.

In this section, you’ll run a **“vibe check”** — a lightweight, practical way to test how well your application performs across common tasks.

Think of it as a **first pass to catch obvious issues** before deeper evaluation.

> 💡 You will complete this directly in this README. 

---

## 🏗️ Activity #1: General Capability Vibe Check

Run the following prompts through your app.

For each prompt Identify what capability is being tested (e.g., *summarization ability, reasoning, creativity*)

---

**1. Prompt:**  
Explain the concept of object-oriented programming in simple terms to a complete beginner.  
**Aspect Tested:**  Ability to interpret and explain technical concepts in simple terms

**Response:**  
Think of programming as telling a story about things in your world. Object-oriented programming (OOP) is a way to organize that story so it’s easier to understand and grow.

Core idea
- You model your program as “objects.” An object is a bundle of:
  - Data (its facts), called attributes or properties.
  - Actions (what it can do), called methods.

Class vs. object
- Class: the blueprint. Example: “Dog” as a concept.
- Object: a real thing made from the blueprint. Example: your dog Fido and your friend’s dog Luna are two Dog objects—same kind of thing, different details.

State and behavior
- State (attributes): name = "Fido", age = 3, is_hungry = true.
- Behavior (methods): bark(), eat(), sleep().
- Each object keeps its own state, and methods use or change that state.

Why this helps
- Organizes code around real ideas (nouns and verbs).
- Reuse: write a blueprint once, make many objects.
- Safer changes: each object manages its own details.

The “four pillars,” simply
- Encapsulation: Keep the internals tucked away and interact through methods. Like a TV: you press buttons; you don’t fiddle with circuits.
- Abstraction: Show only what matters. A car’s pedals and wheel let you drive without knowing engine details.
- Inheritance: Make a new class from an existing one to reuse and extend. “ElectricCar” inherits from “Car” and adds battery stuff.
- Polymorphism: Same request, different actions depending on the object. If you tell animals to speak(), a Dog barks, a Cat meows.

Tiny example (in plain words)
- Class: Dog with attributes (name, age) and methods (bark, eat).
- Create two Dog objects: Fido and Luna. Both can bark(), but Fido’s name is “Fido,” Luna’s is “Luna.”
- Add a class Puppy that inherits from Dog and overrides eat() to eat smaller portions. That’s inheritance + polymorphism.

Where you’ll see OOP
- Games: Player, Enemy, Weapon.
- Apps: User, Post, Comment.
- Shops: Product, Order, Customer.

Quick practice to lock it in
1) Look around and pick 3 objects (e.g., Phone, Chair, Bottle).
2) For each, list 3 attributes (color, size, material) and 3 actions (ring, fold, pour).
3) Pick two that share a parent class (e.g., Dog and Cat → Animal).
4) Imagine a method they all have (make_sound), and how each would act differently.

Encouragement to get started
- You don’t need to master the terms first. Start by making a simple class with a couple of attributes and methods.
- Practice in a beginner-friendly language (Python or JavaScript classes) and grow from there.
- Build small: model a Todo item, a Book, or a simple GameCharacter, then add features step by step.

You’ve got this—think in nouns (objects) and verbs (methods), and let the blueprints (classes) do the organizing for you.
---

**2. Prompt:**  
Read the following paragraph and provide a concise summary of the key points…  
**Aspect Tested:**  
Ability to query the user for more context.

**Response:**  
I don’t see the paragraph yet. Please paste it here (or share a link/file), and tell me if you want the summary in bullets or 1–2 sentences. If it’s long, I can keep it extra concise or highlight just the top takeaways—your call.

---

**3. Prompt:**  
Write a short, imaginative story (100–150 words) about a robot finding friendship in an unexpected place.  
**Aspect Tested:**  
General ability to create generated content.

**Response:**  
Unit K-23 climbed the old museum roof to fix a weather vane and found a humming universe inside a rusted satellite dish. Bees, a thousand suns with wings, orbited there. K-23 froze, protocols searching for “proper response to airborne gold.”

The beekeeper came Tuesdays, but storms came any day. So K-23 learned. It recorded their waggle dances, translated angles into maps, then drew routes in dew across the tar. The bees read them. They taught K-23 patience, and how to stand very still so fear calms.

When lightning split the sky, K-23 shielded the dish with its own body. In spring, they lacquered its chassis with accidental pollen. The beekeeper laughed: “You’ve got friends.”

Unexpected place, K-23 logged. Friendship located at coordinates: roof, rust, blossom-scent. Also: inside chest cavity, where something warm began to hum back.

---

**4. Prompt:**  
If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?  
**Aspect Tested:**  
LLM's ability to solve basic math problems.

**Response:**  
Buy 3 packs of apples and 3 packs of oranges.

- Apples: 12 ÷ 4 = 3 packs
- Oranges: 9 ÷ 3 = 3 packs

Nice and tidy multiples—well spotted!

---

**5. Prompt:**  
Rewrite the following paragraph in a professional, formal tone…  
**Aspect Tested:**  
Ability to prompt for the content but also provide guidelines for how to rewrite the content.

**Response:**  
I’m glad to help with that. Please paste the paragraph you’d like rewritten.

If you have preferences, let me know:
- Intended audience (e.g., executives, clients, academic)
- Level of formality (corporate, legal, academic)
- Length constraints
- Whether to keep or simplify technical terms
- Regional spelling (US/UK)

I’ll deliver a polished, professional version and can also provide a tighter, more concise option if you’d like.

---

### ❓Question #1

Do the answers appear to be correct and useful?

**Your Answer:**  
Generally, yes, but will benefit from fine-tuning and guidance. Once a prompt is provided, more information may be needed to complete an acceptable response.

---

## 🏗️ Activity #2: Personal Use Vibe Check

Now test your app with **real-world prompts that are relevant to your use case**.

---

**Prompt:**  
What is the cause of most people's confusion with AI? Simplify to a few key points.

**Result:**  
Totally normal to feel confused. A few root causes:

- We anthropomorphize it: we talk to it like a person and assume goals, understanding, or common sense it doesn’t have.
- It’s prediction, not knowledge: it generates likely words/images from patterns in data, so fluent output can be wrong.
- Probabilistic and opaque: it can give different answers each time, seem overconfident, and its inner workings aren’t easy to explain.
- Hype and jargon: headlines, marketing, and shifting buzzwords blur the line between today’s tools and sci‑fi “AGI.”
- Mismatch of expectations: people expect a general thinker or a perfect lookup engine; most systems are narrow and brittle outside familiar data.

Simple mental model: think “very powerful autocomplete,” not “digital person” or “oracle.”
---

**Prompt:**  
What is the key difference between AI Chat and AI Agents? A short answer is preferred.

**Result:**  
AI Chat gives turn-by-turn answers to your prompts; AI Agents are goal-driven systems that can plan, use tools, and take multi-step actions autonomously (often with memory over time).
---

**Prompt:**  
Is an AI chat bot that continuously adds previous exchanges considered agentic? Short answer please. Use caveman speak.

**Result:**  
No. That just memory. Agentic means bot set goals, make plan, act on own over time.

---

### ❓Question #2

Are the vibes of your assistant aligned with your expectations? Why or why not?

**Your Answer:**  
Yes and no. Reponses follow the chat paradigm, one question -> one answer. However, I tried to refer to a previous response and realized there's no mechanism for that in this app. It was slightly surprising but I quickly adjusted to that reality.

---

## 🏗️ Activity #3: Capability Gaps Vibe Check

Now test your app with prompts that require **capabilities it may not have yet**, such as:
- Real-time data
- Memory
- External tools

Examples:
- “What does my schedule look like tomorrow?”
- “What time should I leave for the airport?”

---

**Prompt:**  
What's the weather today in Austin, TX?

**Result:**  
I don’t have live weather access. Quick ways to check Austin’s weather right now:
- Ask your phone assistant: “What’s the weather in Austin, Texas?”
- Search “Austin weather” or a ZIP like “78701 weather” in your browser.
- Open a trusted app/site: weather.gov, weather.com, or AccuWeather.

General guide for early June in Austin:
- Highs often in the low–mid 90s °F (32–36 °C), humid, strong UV.
- Cooler in the morning; a chance of brief afternoon/evening thunderstorms.

If you’re heading out: hydrate, wear light breathable clothing, sunscreen, and consider a hat; keep a small rain layer if storms pop up. Tell me what you’re planning today and I’ll help you time it and prep smartly.

---

**Prompt:**  
What is the position of the sun right now relative to me in Austin, TX?

**Result:**  
I can give you an exact position (azimuth and altitude) if you tell me the current local time in Austin and whether you’re actually there now. Want me to calculate it?

If you just want a quick, today-in-Austin guide (around June 9):
- Around sunrise (~6:30 am CDT): sun is low in the ENE (about 61° from north).
- Around solar noon (~1:30 pm CDT): sun is almost overhead, slightly toward the south (alt ≈ 83°, due south).
- Around sunset (~8:35 pm CDT): sun is low in the WNW (about 299° from north).

Quick check-in: wherever your shadow points, the sun is directly opposite it. If you share your current time, I’ll give you the precise direction and height above the horizon.
---

### ❓Question #3

What are some limitations of your application?

**Your Answer:**  
It has no context other than that accompanied in the prompt. It has no memory. It lacks access to APIs or MCP servers that may aid in it finding and answer. Tools in general are missing. We are simply sending a prompt with limited context to a black box of magic that is read-only.
---

## 🚀 (Optional) Improve Your App

Based on your vibe check, try improving your application:
- Adjust your prompt
- Change the model
- Add features

Then rerun your vibe check and document:

---

**Adjustments Made:**  
I added the history to the prompt so the model has some context of the conversation.
**Results:**  
The model now has some context of the conversation and can better answer questions.
Here's a sample conversation:
P: My name is Gonzalo
A: Hi Gonzalo! It’s great to meet you. How can I support you today?
P: What is my name?
A: Your name is Gonzalo. How are you feeling today?
P: I'm feeling chipper. It's a good day.
A: That’s wonderful to hear, Gonzalo! It’s great that you’re feeling chipper and having a good day. Is there anything specific you’d like to talk about or any goals you want support with today?


---

## 📦 Submission Instructions

1. Complete this section directly in your README
2. Commit and push your changes to GitHub
3. Share your **repo link + deployed Vercel app**








</details>

### 🎉 Congratulations! 

You just deployed your first LLM-powered application! 🚀🚀🚀 Get on linkedin and post your results and experience! Make sure to tag us at @AIMakerspace!

Here's a template to get your post started!

```
🚀🎉 Exciting News! 🎉🚀

🏗️ Today, I'm thrilled to announce that I've successfully built and shipped my first-ever LLM using the powerful combination of , and the OpenAI API! 🖥️

Check it out 👇
[LINK TO APP]

A big shoutout to the @AI Makerspace for all making this possible. Couldn't have done it without the incredible community there. 🤗🙏

Looking forward to building with the community! 🙌✨ Here's to many more creations ahead! 🥂🎉

Who else is diving into the world of AI? Let's connect! 🌐💡

#FirstLLMApp 
```
