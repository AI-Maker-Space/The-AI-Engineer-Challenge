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
**Aspect Tested:**  <!-- Write your answer here -->
Summarization Ability
**Response:**  
Great question—wrapping your head around OOP is a smart move, and you’ve got this.

Big idea:
Object-oriented programming (OOP) is a way of organizing code by thinking in terms of real-world “things.” Each “thing” has:
- Data (what it is)
- Actions (what it can do)

Key parts:
- Class: A blueprint or recipe (for example, “Car”).
- Object: A real item made from that blueprint (for example, “my red car”).
- Attributes (properties): The data an object holds (color, speed).
- Methods: The actions an object can do (start, brake).

The four core ideas, in plain language:
- Encapsulation: Keep related data and actions together in one “capsule,” and hide the messy details. You can drive a car without knowing how the engine works.
- Inheritance: Make a new class from an existing one to reuse and extend it. “ElectricCar” can inherit from “Car” and add a battery.
- Polymorphism: One common action name, different behaviors. Ask any “Animal” to speak; a Dog barks, a Cat meows.
- Abstraction: Focus on essentials, ignore extra detail. You use the steering wheel and pedals, not every bolt in the engine.

Tiny example (no code needed):
- Class: Dog
  - Attributes: name, age
  - Methods: bark(), eat()
- Objects: “Fido” and “Luna” are two Dogs. Both can bark, each with their own name and age.

Why OOP helps:
- Organizes code into clear, reusable building blocks
- Makes big programs easier to understand and change
- Reduces repeated code and bugs

How to practice (gentle first steps):
- Pick a simple theme you like (pets, cars, library books, a to-do list).
- List nouns (these become classes) and their details (attributes).
- List verbs (these become methods).
- Create a couple of objects and “use” their methods.
- Start small; add one feature at a time.

Languages that use OOP include Python, JavaScript, Java, and C++. If you’re brand-new, Python is a friendly place to start.

You’re on the right track—keep it simple, build a tiny example, and celebrate each small win.
---

**2. Prompt:**  
Read the following paragraph and provide a concise summary of the key points…  
**Aspect Tested:**  Summarization Ability
**Response:**  
Love it—let’s tailor this so it really lands. Pick from the options below (or mix and match), or tell me your goal and I’ll recommend a combo.

Topics (select one)
- Human–AI collaboration at work: practical ways to augment, not replace, your role
- AI and mental well-being: benefits, risks, and healthy habits for mindful use
- Ethical AI in practice: reducing bias, protecting privacy, adding oversight
- AI for education: smarter study, academic integrity, and accessibility
- Sustainability of AI: energy use today and how to shrink the footprint
- The next 5 years of generative AI: realistic predictions vs hype
- Prompting like a pro: a hands-on guide with examples
- AI in healthcare: triage to diagnosis, with safety guardrails

Style (choose one)
- Conversational explainer
- Factual report/mini white paper
- Step-by-step playbook or checklist
- Case study narrative
- Op-ed/persuasive essay
- Short story or sci‑fi vignette
- Poetic/lyrical tone
- Q&A interview format

Intended audience (choose one)
- General readers
- High school or college students
- Working professionals changing careers
- Executives/non-technical leaders
- Developers/data scientists
- Educators
- Policymakers
- Artists/creatives

Helpful extras (optional)
- Length: ~500, ~1,000, or ~1,500 words
- Tone: optimistic, balanced, or cautionary
- Region/context: any specific country or industry?
- Include stats and citations: yes/no
- Include a takeaway checklist or action steps: yes/no

If you’re unsure, I can start with: “AI and mental well-being” as a conversational explainer for general readers (about 800–1,000 words) with a short, practical checklist.
---

**3. Prompt:**  
Write a short, imaginative story (100–150 words) about a robot finding friendship in an unexpected place.  
**Aspect Tested:** Creativity

**Response:**  
In the thicket of rooftop antennas, Sweep-9 found it: a faded red kite snarled in a spine of rusted aluminum. Its paper skin whispered when the wind worried it. Sweep-9 logged “debris” and reached to free it; the gust tugged back, as if shy. He paused. His microphones learned the kite’s language—small shivers, long sighs, taut silences. The city below ticked; above, the sky breathed.

He taped the torn seam with a strip from his own weatherproofing and tied a length of heater wire to the spool. The kite rose, trembled, laughed against the wind. At night, it rattled stories of storms and strangers’ hands; he hummed about bolts and quiet circuits.

On a forgotten roof, a robot and a kite kept one another aloft—proof that friendship can lift from the unlikeliest tangle.

---

**4. Prompt:**  
If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?  
**Aspect Tested:**  <!-- Write your answer here -->

**Response:**  
Buy 3 packs of apples (3 × 4 = 12) and 3 packs of oranges (3 × 3 = 9). Nice and clean solution!
---

**5. Prompt:**  
Rewrite the following paragraph in a professional, formal tone…  
**Aspect Tested:**  <!-- Write your answer here -->

**Response:**  
<!-- Add your app's response here -->
Think of artificial intelligence as a highly capable digital assistant that has processed vast amounts of information and operates around the clock. It powers systems that predict the next video you are likely to watch on platforms such as TikTok, helps refine sensitive messages to a manager, and can automatically enhance low-quality, late-night photos. Rather than following only fixed rules, these systems learn by identifying patterns in large datasets, much like how skills develop through practice and feedback. The technology’s influence is expanding rapidly—from supporting earlier detection of medical conditions to proposing recipes based on the ingredients you have available. While powerful, AI is not infallible; it can misinterpret inputs or confidently generate incorrect information, underscoring the need for human judgment and oversight. Ultimately, it is a tool designed to augment human capabilities and make everyday tasks more efficient and, often, more engaging.
---

### ❓Question #1

Do the answers appear to be correct and useful?

**Your Answer:**  
Yes
---

## 🏗️ Activity #2: Personal Use Vibe Check

Now test your app with **real-world prompts that are relevant to your use case**.

---

**Prompt:**  
Everytime I code for long periods of time, my head aches. why?

**Result:**  
You’re not alone—long coding sessions commonly trigger headaches. A few usual culprits:

- Eye strain: staring at near text lowers your blink rate, dries your eyes, and overworks your focusing muscles. Small fonts, high contrast, glare, or overly bright/dim screens make it worse. Uncorrected vision can amplify it.
- Posture and tension: hunching or craning your neck tightens neck/shoulder muscles, leading to tension headaches. Staying still for hours doesn’t help.
- Hydration, food, caffeine, sleep: not drinking enough, skipping meals, irregular caffeine use (too much or withdrawal), and poor sleep raise your risk.
- Cognitive load and stress: intense focus, deadline pressure, even jaw clenching can contribute.
- Environment: harsh overhead lights, screen flicker, or PWM dimming on some monitors can trigger headaches.

Practical tweaks to try this week

- Breaks that actually reset your eyes and body
  - 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds. Blink slowly 10 times.
  - Work in sprints (e.g., 50 minutes on, 10 off). Stand, walk, or stretch your neck/shoulders during breaks.
- Ergonomics and display
  - Monitor roughly an arm’s length away, top at or just below eye level. External keyboard/mouse if you’re on a laptop.
  - Feet flat, hips slightly higher than knees, elbows ~90°, wrists neutral, back supported.
  - Increase font size and line spacing; avoid tiny code. Consider softer themes (not ultra-high contrast white-on-black).
  - Match screen brightness to the room; reduce glare; use a desk lamp instead of harsh overheads.
  - If you can, use a flicker-free, higher refresh rate display. Avoid very low brightness on screens that use PWM dimming.
  - Nighttime: use a warm color temp to reduce circadian disruption; for headaches, brightness/contrast tends to matter more than “blue light” alone.

When to get professional help

- If headaches are frequent, worsening, or don’t improve after a couple of weeks of these changes, see an optometrist for a vision check and consider talking with your clinician.
- Seek urgent care if you have red flags: a sudden “worst headache,” fever/neck stiffness, head injury, new weakness/numbness/speech or vision changes, or headaches that wake you from sleep with vomiting.

If you share a bit more, I can tailor suggestions:
- Where is the pain (forehead, behind eyes, temples, neck)?
- How long into a session do headaches start?
- What’s your current setup (laptop only or external monitor, brightness, theme, font size)?
- Do you wear glasses or contacts? Last eye exam?
- How are your breaks, hydration, sleep, and caffeine habits right now?
---

**Prompt:**  
When I wake up in the morning, I feel tired and unmotivated. How can I stop that?
**Result:**  
Feeling drained and flat in the morning is tough, and it can turn into a loop. The good news: a few small tweaks—especially the night before and the first 30–60 minutes after waking—can make a big difference.

Before I suggest a plan, a few quick questions (answer any you can):
- How many hours of sleep do you usually get, and is your wake time consistent?
- Do you snore loudly, wake gasping, or have morning headaches/dry mouth?
- Alcohol or caffeine timing (especially late afternoon/evening)?
- Screens in bed or right before sleep?
- Do the low energy and motivation last all day, or mainly mornings?
- Any recent stress, low mood for 2+ weeks, or meds that make you drowsy?

A simple 7‑day reset (do these five things)
1) Anchor your wake time (every day, within 30–60 minutes, even weekends). Aim for 7–9 hours of sleep opportunity by counting back from that wake time.
2) Morning light + movement: within 30 minutes of waking, get 5–10 minutes of outdoor light (no sunglasses if safe) and 2–5 minutes of light movement (stretching, brisk walk, a few squats).
3) Hydrate, then delay caffeine: drink a full glass of water on waking; have caffeine 60–90 minutes later to reduce the mid‑morning crash.
4) Tiny first win: pick one 10‑minute task you’ll start right after your light/movement. Use a timer. Tell yourself, “I only have to do 10 minutes.” Action often creates motivation.
5) Night-before wind‑down: last 60 minutes are low light, low screen, low stress. Lay out clothes, set your “first 10‑minute task,” put your phone/alarm across the room.

Upgrades if you want more momentum
- Protein-forward breakfast (20–30g) within 1–2 hours of waking to stabilize energy. Minimize sugary starts.
- Cut caffeine after 2 p.m.; avoid alcohol within 3–4 hours of bed.
- Cool, dark, quiet room; keep the bed for sleep only. If you’re awake >20 minutes, get up briefly and do something calm in dim light.
- Use a countdown (5–4–3–2–1) to get out of bed; no snooze.
- “If–then” plans: If I finish my water, then I go outside for light. If I start coffee, then I do 10 minutes on Task X.
- Motivation boosters: energizing playlist, “temptation bundling” (podcast only during your morning walk), message a friend when you complete your 10 minutes.
- Midday slump: a 10–20 minute nap before 3 p.m. or a 10‑minute non‑sleep deep rest (NSDR) audio.

If you want, share your current bedtime, wake time, and what your mornings look like now. I can tailor a 7‑day plan to your schedule and help you pick that first 10‑minute “win” so it’s almost impossible to skip.

---

**Prompt:**  
How can i stop feelings of depressoin. keep it brief

**Result:**  
I’m sorry you’re feeling this way. Quick, practical steps:

- Move your body daily (even a 10–20 min walk, ideally in daylight).
- Keep basics steady: regular sleep/wake, meals, water; limit alcohol/weed.
- Don’t isolate: text/call one supportive person today.
- Calm the body: 2–5 minutes of box breathing (4-4-4-4) or a guided meditation.
- Tiny wins: pick one 5-minute task and finish it; notice the win.
- Write it out: name the feelings; challenge all-or-nothing thoughts.
- Add one small enjoyable thing each day (music, shower, sunlight).

If these feelings last 2+ weeks or disrupt life, please reach out to a therapist or doctor. If you might hurt yourself, get help now: call your local emergency number or a crisis line (US: 988; see findahelpline.com for other countries). You’re not alone.
---

### ❓Question #2

Are the vibes of your assistant aligned with your expectations? Why or why not?

**Your Answer:**  
Yes, they are. The assitant gives sound mental advice and asks for more info from the user where needed
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
What does my schedule look like tomorrow?

**Result:**  
I don’t have access to your calendar, so I can’t see tomorrow’s schedule yet. If you paste your meetings or tell me your commitments, I’ll organize them into a balanced plan.

If it helps, reply with:
- Start/finish times and time zone
- Fixed meetings (with times)
- Top 1–3 priorities for the day
- Personal non-negotiables (workout, errands, family)
- Any energy peaks/slumps you expect

Quick template you can fill:
- Morning (wake, prep): 
- Fixed meetings: 
- Priority 1 deep-work block (60–90 min): 
- Break/movement (10–20 min): 
- Priority 2 block: 
- Lunch (unplugged): 
- Admin/comms (30–60 min): 
- Priority 3 or meetings: 
- Buffer/catch-up: 
- Wrap-up (review + plan tomorrow, 10 min): 
- Evening wind-down:

If you’d like, I can also draft a default schedule now based on typical energy rhythms—just tell me your start/finish window.

---

**Prompt:**  
How many volcanos are erupting right now?

**Result:**  
At any given time, roughly 20–30 volcanoes are actively erupting worldwide. If you include low-level activity (like mild strombolian bursts or continuous degassing), the number is often closer to 40–60.

The exact count changes day to day and depends on how “erupting” is defined. For the current, precise number, check:
- Smithsonian Global Volcanism Program – Weekly Volcanic Activity Report
- VolcanoDiscovery – “Volcanoes Today” page
- USGS Volcano Activity status map (for US/territories)

If you’re asking because you’re concerned about risk where you live, tell me your location and I’ll help put the current activity in context.
---

### ❓Question #3

What are some limitations of your application?

**Your Answer:**  
- It does not know real time information. It's knowledge base ends in October 2024, so it doesnt know real time info after that. 
- Also you can't switch roles. It always has the role of a "supportive mental coach"
- Chat history is not kept, so long conversations are hard to make.
---

## 🚀 (Optional) Improve Your App

Based on your vibe check, try improving your application:
- Adjust your prompt
- Change the model
- Add features

Then rerun your vibe check and document:

---

**Adjustments Made:**  
- I added the previous chat history to the API request from the frontend and passed it to the model

- I controlled the randomness by passing a value for the `temperature` that is between to 0.3 and 0.8

- I rewrote the `system_prompt` to be more structured and specific with rules and a practical example.

**Results:**  
<!-- What improved? What didn’t? -->
- Long conversations now possible as it refrences prior messages  
- More deterministic and concise answers. The tone and structure is always familiar
- Better structured answers, follows specified rules
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
