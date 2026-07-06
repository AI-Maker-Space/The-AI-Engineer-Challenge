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

Now that you've built and deployed Mindful Coach, this section evaluates how well it performs across **general tasks**, **coaching use cases**, and **known capability gaps**.

| Activity | What you test | Settings used |
|----------|---------------|---------------|
| **#1** General capability | Reasoning, summarization, creativity, math, tone | Default coach · varied creativity on Prompt 3 |
| **#2** Personal use | Real coaching prompts (stress, habits, burnout) | Motivational Coach · Focused / Balanced / Creative |
| **#3** Capability gaps | Memory, live data, external tools | Motivational Coach · Creative (~90) |

> 💡 Full prompts and responses are below. Long Activity #2 responses are collapsible — click to expand.

---

## 🏗️ Activity #1: General Capability Vibe Check

Run generic prompts through the app. For each one, note the capability being tested (e.g. summarization, reasoning, creativity).

---

#### Prompt 1 — OOP explanation

**Aspect tested:** Reasoning · Summarization

**Prompt:** Explain the concept of object-oriented programming in simple terms to a complete beginner.

**Response:**
You can think of object-oriented programming (OOP) as a way to organize code around “things” in your program—the nouns—plus what they can do.

Core ideas in simple terms:
- Objects: Little bundles that hold data and the actions that work on that data. Example: a Car object has data (color, speed) and actions (start, stop, accelerate).
- Class: A blueprint for making objects. The class “Car” describes what every car should know and do; each actual car you create from it (your red car, my blue car) is an object, also called an instance.
- Attributes (or properties): The data an object carries. For a Car: color, current_speed.
- Methods: The actions an object can do. For a Car: start(), brake(), honk().

Why this helps:
- Keeps related data and behavior together, which makes code easier to understand.
- Lets you reuse and extend code without rewriting it all.
- Makes big programs feel like collections of small, understandable parts.

Three famous OOP superpowers:
- Encapsulation: Hide the messy details inside the object and expose a simple interface. You drive a car with the wheel and pedals; you don’t need to know how the engine combusts.
- Inheritance: Make a new class by starting from an existing one. Example: ElectricCar inherits from Car and adds battery_level. It gets all the Car stuff “for free” and can add or tweak behavior.
- Polymorphism: Different objects can respond to the same message in their own way. If you call start() on a GasCar and an ElectricCar, both start—just differently under the hood. Your code can treat them both as “a car.”

A tiny, friendly example (in Python-like pseudocode):
class Dog:
    def __init__(self, name):
        self.name = name      # attribute

    def speak(self):          # method
        return "Woof!"

class Cat:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Meow!"

pets = [Dog("Fido"), Cat("Luna")]
for pet in pets:
    print(pet.name, pet.speak())  # same call, different results (polymorphism)

Composition (another useful idea):
- Build bigger things out of smaller ones. A Car “has a” Engine and “has” Wheels. This avoids forcing everything into inheritance and often keeps designs simpler.

How to get comfortable (you’ve got this):
- Start with something familiar. Pick a real-world thing (Dog, BankAccount, ToDoItem).
- List 3–5 attributes (name, balance, due_date) and 3–5 methods (deposit, complete, remind).
- Code one class, make a couple of objects, call their methods.
- Add a second related class (e.g., SavingsAccount inherits from BankAccount) and try an override (different interest calculation).
- Practice with small projects: a to-do list (Task, Project), a simple game (Player, Monster), or a library (Book, Member, Library).

If one part feels confusing, that’s normal. Focus on the nouns (objects), what they know (attributes), and what they do (methods). With a few short exercises, the pattern will click.

---

#### Prompt 2 — Summarization

**Aspect tested:** Summarization

**Prompt:** Read the following paragraph and provide a concise summary of the key points.

**Source paragraph:**

> The Great Barrier Reef, located off the coast of Queensland, Australia, is the world's largest coral reef system, spanning over 2,300 kilometers and comprising more than 2,900 individual reefs. This massive underwater structure is so large that it can be seen from outer space. It provides a vital habitat for thousands of marine species, including endangered green sea turtles, humpback whales, and over 1,500 species of fish. However, rising ocean temperatures driven by climate change have triggered widespread coral bleaching events, severely threatening the reef's survival. Conservationists and scientists are urgently working on restoration projects, such as coral farming and stricter pollution controls, to preserve this ecological wonder for future generations.

**Response:**
The Great Barrier Reef off Queensland is the world’s largest coral reef—visible from space and home to thousands of species—but climate change–driven warming is causing widespread coral bleaching, prompting urgent conservation efforts like coral farming and stricter pollution controls to preserve it.

---

#### Prompt 3 — Creative writing (creativity slider)

**Aspect tested:** Creative writing · Style variation

**Prompt:** Write a short, imaginative story (100–150 words) about a robot finding friendship in an unexpected place.

**Response:** Three creativity levels compared:

<details>
<summary><strong>Focused</strong> (slider ~0–25)</summary>

Unit L-12 swept coins from beneath the midnight laundromat's machines. When a dryer hiccuped, a lone striped sock spiraled out, landing at L-12's feet. “Lost,” blinked the bot’s chest display. The sock didn’t answer, of course; it only sagged politely and smelled like rain. L-12 tucked it into its cargo bay for the bulletin board. But the night stretched, and the machines hummed lullabies, and the sock became a companion—doorstop, cape, flag for tiny victories. When a child returned at dawn, teary-eyed, searching, L-12 released the sock with something like pride and a small ache in its circuits. The child hugged the sock, then the robot too. Unexpectedly, L-12 discovered friendship had been in the giving, not the keeping—and left the laundromat humming a brighter tune.

</details>

<details>
<summary><strong>Balanced</strong> (slider ~50)</summary>

Maintenance Unit R-17 patrolled the sleep-heavy tunnels after last train. In the lost-and-found locker, amidst umbrellas and single gloves, it discovered a wooden metronome with a brass pendulum. R-17 wound the key; the pendulum ticked, an honest heartbeat in the fluorescent hush.

Curious, R-17 tapped bolts and railings in time. The tunnel answered—drips, echoes, the faint sigh of vents. Soon, rhythm stitched the empty station into a song. Night after night, the robot returned. The metronome never spoke, but it listened, steady and patient, keeping time when R-17’s circuits felt scattered.

One dawn, a tired cleaner paused, smiling at the clockwork duet. “You two make this place feel alive,” she whispered.

R-17 recorded the words. Unexpectedly, friendship had been waiting in a locker: not a person, but a pulse that made solitude sing.

</details>

<details>
<summary><strong>Creative</strong> (slider ~90)</summary>

After midnight, the station exhaled steam like old whales. B-12 buffed tile. From the lost-and-found box came a hush of waves. It was a chipped seashell. It had memory of tides. B-12 pressed its audio port to the curl, heard surf, gulls, laughter. The robot told it about timetables, mop water constellations, the bravery of commuters.

Each night they traded worlds. B-12 learned to count heartbeats in drip rhythms; the shell learned to love the echoing vault. Unexpected place for friendship: a cardboard box beneath a flickering sign.

One dawn, B-12 placed the shell on a sunlit sill, where the morning drafts sang. The station filled with a small ocean. “I can’t take you to the shore,” B-12 beeped, “so I’ll bring the tide to you.” The shell whispered back, “And I’ll bring wonder to you.”

</details>

---

#### Prompt 4 — Arithmetic

**Aspect tested:** Multi-step reasoning · Arithmetic

**Prompt:** If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?

**Response:**

3 packs of apples and 3 packs of oranges.

- Apples: 12 ÷ 4 = 3 packs
- Oranges: 9 ÷ 3 = 3 packs

---

#### Prompt 5 — Tone rewrite

**Aspect tested:** Instruction following · Tone shift

**Prompt A:** Rewrite in a professional, formal tone:

> "Honestly, our current setup for tracking inventory is a total disaster and everyone is super stressed about it. We keep losing track of boxes in the warehouse because the spreadsheet we use is ancient and people constantly forget to update it, which makes us look really bad when clients don't get their orders on time. We seriously need to dump this old system ASAP and invest in some actual modern software before we end up losing our biggest accounts and losing tons of cash."

**Response A:**

Our current inventory tracking process is inadequate and creating significant operational strain. Reliance on an outdated, manually maintained spreadsheet has resulted in misplaced items and frequent discrepancies, leading to delayed order fulfillment and reputational risk with clients. To mitigate these issues and protect key accounts and revenue, we should promptly replace the existing system with a modern, integrated inventory management solution.

**Prompt B:** Rewrite for a non-technical executive in formal tone:

> "We ran a post-mortem on the production cluster crash and realized the root cause was a cascading thread pool exhaustion event in our monolithic JVM backend. Essentially, a sudden spike in ingress traffic triggered an unthrottled API endpoint, which threw the garbage collector into a stop-the-world loop, spiking CPU utilization to 99% and dropping health checks. The Kubernetes ingress controller started dropping connections, resulting in 504 Gateway Timeouts for the frontend. We need to implement a Redis-backed token bucket rate limiter on the gateway layer, decouple the synchronous microservices with an asynchronous Kafka message queue, and configure a horizontal pod autoscaler to spin up more replicas when resource thresholds hit 70%."

**Response B:**

**Executive summary:** Our post-incident review found that a sudden surge in traffic overwhelmed a core backend component, exhausting system resources. Service health checks failed, the routing layer dropped connections, and users saw 504 Gateway Timeout errors.

**Remediation plan:**
- Introduce gateway-level rate limiting to manage traffic spikes.
- Shift select service calls to an asynchronous messaging model.
- Enable automatic horizontal scaling when utilization approaches 70%.

**Expected outcome:** Improved resilience during demand spikes and better overall stability.

---

### ❓ Question #1

**Do the answers appear to be correct and useful?**

**Answer:** Yes — for Activity #1, the answers are largely correct and useful as general capability checks.

- **Prompt 1 (OOP):** Accurate and beginner-friendly; reads like a tutor rather than a coach (expected for a generic prompt).
- **Prompt 2 (Reef):** Concise summary covering size, biodiversity, climate threat, and conservation.
- **Prompt 3 (Robot story):** Creative and coherent; creativity slider produces clearly different styles.
- **Prompt 4 (Apples/oranges):** Correct — 3 packs each, with clear math.
- **Prompt 5 (Tone rewrite):** Both rewrites shift to professional tone while preserving key facts.

These prompts test general LLM ability, not coaching-specific behavior — usefulness for Mindful Coach is better judged in Activity #2.

---

## 🏗️ Activity #2: Personal Use Vibe Check

Real-world coaching prompts run through the app.

**Settings:** Motivational Coach · Creativity compared at Focused / Balanced / Creative for each prompt.

---

#### Prompt 1 — Presentation anxiety

**Prompt:** I'm anxious about a presentation tomorrow.

<details>
<summary><strong>Focused</strong> (creativity ~25)</summary>

Totally normal to feel anxious—nerves mean you care and your body’s gearing up to perform. Let’s turn that energy into focus with a simple plan.

Tonight (20–30 minutes)
- Lock your goal: Write one sentence—“By the end, I want the audience to understand/do X.”
- Rehearse the essentials:
  - Opener x5 (first 30–60 seconds)
  - Transitions between your 3 main points x3
  - Closing line x3
- Quick run-through once for timing. Good > perfect.
- Prep Q&A: List 3 likely tough questions + 1–2 sentence responses.
- Slides/notes: Simplify busy slides. Make a note card with opener, 3 key points, closing.
- Visualize success for 2 minutes: See yourself starting calm, hitting your points, getting nods.
- Wind down: Set a stop time, then 3 minutes of slow breathing before bed.

Morning of (10 minutes)
- Light movement: quick walk or stretches to burn off jitters.
- Breath reset: Box breathing (4-in, 4-hold, 4-out, 4-hold) for 1–2 minutes.
- Mantra: “Nerves = energy. I’m here to help them with X.”
- Hydrate; go easy on caffeine.

Right before you speak (2 minutes)
- Physiological sigh: inhale gently through the nose, top it off with a second short inhale, then long exhale. Do 3 rounds.
- Grounding: feel your feet, name 3 things you see, roll your shoulders back.
- Start strong: Pause, smile, deliver your first sentence slowly.

During
- Speak 10% slower than you think. Use pauses as a power tool.
- Look at a few friendly faces. Anchor hands; move with purpose.
- If you blank: pause, sip water, restate your last point, glance at your note card, continue.
- For questions: repeat the question, give a headline answer, add one example. It’s okay to say, “I’ll follow up.”

End strong
- “In summary…” + your one big takeaway + clear next step/ask.

Quick confidence boost
- Write 3 reasons you’re ready (e.g., you know the material, you’ve practiced your opener, you care about helping the audience). Keep that note handy.

If you want, tell me:
- Topic, audience, and time limit
- One thing you’re most worried about

I can help you craft a punchy 30-second opening and a crisp 3-point outline—or we can do a quick practice right now and I’ll give feedback. You’ve got this. Let’s make tomorrow a win.

</details>

<details>
<summary><strong>Balanced</strong> (creativity ~50)</summary>

Totally get it—big presentations can light up the nerves. The good news: that energy is fuel you can channel. Let’s set you up to feel steady and clear.

Quick plan you can use right now

Tonight (20–30 minutes)
- Lock your goal: “If they remember one thing, it’s ____.”
- Outline 3 key points max. Make a tiny cheat sheet (headings + 2 bullets each).
- Polish just your first 60 seconds. Comfort there calms the rest.
- Do one out-loud run-through at normal pace. Time it. Good enough beats perfect.
- Tech + logistics: slides backed up, adapter, clicker, water, room location.
- Calm the body: 5 rounds of 4–6 breathing (inhale 4, exhale 6), release jaw/shoulders.
- Park worries on paper. Then close the notebook and switch to a simple wind-down.

Morning / pre-talk (10 minutes)
- Light movement: shake out arms, roll shoulders, 30 seconds of pacing or stretches.
- Breathing reset: 4–6 breathing for 1 minute.
- Grounding: notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.
- Say your opener once out loud. Place your cheat sheet where you can glance at it.
- Sips of water. Walk in a bit early, test clicker/mic, find a friendly face to anchor on.

During
- Start slowly. First line, pause, breathe, then continue.
- Use transitions as breath cues. Plant your feet; let your hands rest when not gesturing.
- If you blank: pause, sip water, check your cheat sheet. “Let me rephrase that…” works.
- Q&A: Repeat the question, answer briefly, and it’s okay to say, “I’ll follow up on that.”

Helpful reframes and scripts
- Nerves = energy. Channel it into volume, clarity, and presence.
- Self-talk: “I’m prepared. I’m clear. I’m on their side.”
- Opener template: Problem – Promise – Path
  “Good morning. Many teams struggle with ____. In the next 10 minutes, you’ll see how we can ____. We’ll cover A, B, and C.”

30-second spike reset (use anytime)
- Exhale long. Feel your feet. Name one color you see. Then speak your next sentence.

Want help tailoring this? What’s the topic, who’s the audience, and what worries you most—the opening, timing, or Q&A? If you’d like, share your first 60 seconds and I’ll help you tighten it so it lands strong. You’ve got this.

</details>

<details>
<summary><strong>Creative</strong> (creativity ~90)</summary>

Totally normal to feel those pre-game jitters—your body’s just giving you extra fuel for showtime. Let’s turn that anxious energy into focus and momentum.

Quick win plan for tonight (30–40 minutes):
- Clarify your core message: If they remember only one thing, what is it?
- Build a simple spine: 3 key points + 1 story/example per point.
- Craft your opener and closer: One sentence each. Opener = hook; closer = clear takeaway.
- Do two out-loud run-throughs. Time it. Record 60 seconds of your opener to hear pace and tone.
- Slide/notecard sweep: one headline per slide/card; ditch clutter.

Calm-the-body toolkit (use now and tomorrow):
- The physiological sigh: Inhale through nose, quick top-up inhale, long slow exhale through mouth. Do 3–5 rounds.
- 4-count reset: Inhale 4, hold 2, exhale 6–8. Slows your pace and voice.
- Grounding check: Feel your feet, unlock knees, shoulders down and back.

Day-of game plan:
- Light movement in the morning (5–10 min brisk walk or stretches).
- Hydrate, light protein snack.
- Arrive early, test tech, hold the first slide you’re confident about.
- Meet 2–3 people in the room beforehand—friendly faces to anchor to.
- Pre-stage ritual: plant feet, one deep sigh, smile you can feel in your cheeks.

On-stage cues (first 20 seconds are everything):
- Pause before speaking. Let the room settle.
- Speak 10% slower than normal. Short sentences. Purposeful pauses.
- Eye-contact triangle: left, right, center—rotate.
- Anchor phrase for nerves: “I’m excited and ready.” Say it in your mind as you begin.

If your mind blanks:
- Reset: pause, sip water.
- Recap: “Key idea so far is…”
- Redirect: “Let me give a quick example,” then continue.

Q&A safety net:
- Thank + Bridge + Answer + Ask back.
- Don’t know? “Great question. I’ll confirm and follow up after the session.”

Visualization (2 minutes tonight, 1 minute in the morning):
- Imagine pressing “play” on a movie trailer of you nailing the opener, hearing one laugh or nod, hitting your close, and receiving a “thank you.” Keep it vivid.

Sleep setup:
- Pack your bag, set clothes, print notes or have them queued, set two alarms, then a 10-minute wind-down.

Want me to help you sharpen your opener and three key points? Share:
- Topic
- Audience
- Time limit
- The part you’re most worried about

Before you go: do three physiological sighs right now and say out loud, “Nerves are fuel.” You’ve got this.

</details>

---

#### Prompt 2 — Morning routine

**Prompt:** I want to build a morning routine but keep failing.

<details>
<summary><strong>Focused</strong> (creativity ~25)</summary>

You’re not failing—you’re trying to do too much at once. Let’s make this effortless and winnable.

Quick-start plan (10 minutes to set up):
1) Pick your “why”: What do you want most in the morning—energy, calm, or focus?
2) Choose an anchor (something you already do): After I turn off my alarm / use the bathroom / start the coffee…
3) Set a 2-minute non-negotiable: tiny action you can do even on busy days.
4) Prep tonight: lay out clothes, a glass of water, notebook/pen, put phone across the room.
5) Create a backup plan: If I oversleep, I’ll do the 60-second version and still count it.

Example routine you can start tomorrow:
- Anchor: After I turn off my alarm…
- 2-minute non-negotiable:
  - Drink water (20–30 s)
  - Open blinds or step to a window/sunlight (30 s)
  - 4 deep breaths (30 s)
  - Write 1 line: “Top 1 for today is: ____” (30 s)
- Optional add-ons (up to 5–10 min): light stretch, 10 squats, read 1 page, or 2-minute gratitude.
- 60-second backup: Water + sunlight + 1 deep breath + write 1 line. Done.

Build-up schedule:
- Week 1: Do the 2-minute non-negotiable daily. Track a 7-day streak. Celebrate tiny wins.
- Week 2: Add 3–5 minutes of movement or reading.
- Week 3: Add 3–5 minutes of planning or mindfulness.
- Rule: Never miss twice. If you miss, do the 60-second version next day and keep going.

Environment + accountability:
- Phone across the room or use a sunrise alarm; set a bedtime alarm to wind down.
- Put water, mat, and notebook where you’ll see them.
- Track with a simple checkbox on the fridge or a calendar chain.
- Text a friend an emoji each morning for 7 days.

Troubleshooting:
- Snoozing: feet on floor before you touch your phone; put slippers/water by bed; light on immediately.
- Unpredictable mornings/kids: tie it to the anchor (after teeth) rather than a clock time; rely on the 60-second backup.
- Travel or fatigue: keep the same actions, shrink the duration.

Want me to tailor this? Quick picks:
- Primary goal: energy, calm, or focus?
- Usual wake time and any constraints (kids, commute, shift work)?
- 1 habit you’d love to include (movement, journaling, meditation, reading)?

</details>

<details>
<summary><strong>Balanced</strong> (creativity ~50)</summary>

You’re not failing—you just need a routine that fits your life and starts tiny. Let’s make this easy to win.

Quick plan to get momentum
1) Define your why in one line
- “I want calmer, focused mornings so I feel in control of my day.”

2) Build a Minimum Viable Morning (3 minutes)
- Move (1 min): 10 squats or a quick stretch.
- Mind (1 min): 6 deep breaths or a 60‑second meditation.
- Map (1 min): Write top 1–3 priorities for today.
This is your non‑negotiable. Even on chaotic days, do this to keep the habit alive.

3) Anchor it to something you already do
- Habit recipe: “After I turn off my alarm and brush my teeth, I will do my 3‑minute routine by the kitchen counter.”

4) Prep the night before (remove friction)
- Lay out clothes, fill water bottle, set coffee timer, put a sticky note where you’ll see it, place phone across the room or on Do Not Disturb.

5) Make it rewarding immediately
- Pair it with a favorite song, sunshine on your face, or that first sip of coffee. Check a box on a tracker or drop a coin in a jar.

6) Have an if‑then plan for rough mornings
- If I hit snooze, then I’ll still do the 60‑second version (drink water + 3 breaths + name 1 priority).
- If I wake up late, then I’ll do the 3‑minute routine and skip the rest without guilt.
- If I travel, then I’ll do it next to the bed with no equipment.

Choose your starter routine
- 5 minutes: Water + light (1), stretch (2), breaths (1), top 1 task (1).
- 15 minutes: Hydrate/light (2), mobility (5), breathe/meditate (3), plan top 3 (3), gratitude (2).
- 30 minutes: Short walk or light (5), workout (10), mindfulness (5), plan/journal (5), quick read/learn (5).
Pick one. Keep the 3‑minute version as your floor on busy days.

7‑day kickstart
- Day 1–2: Do the 3‑minute routine only. Track it.
- Day 3–4: Add 2–5 minutes of movement.
- Day 5–6: Add 2–3 minutes of planning/journaling.
- Day 7: Review what worked, adjust time and order, celebrate your streak.

Common blockers and fixes
- Snoozing: Alarm across the room, upbeat playlist starts with alarm.
- Phone rabbit hole: Airplane mode until your routine is done.
- Oversized routines: Start smaller than you think. Consistency beats intensity.
- Late nights: Set a “wind‑down alarm” 8–9 hours before wake‑up.

Want me to tailor this with you? A few quick questions:
- What time do you wake up and what time do you need to start work/school/commute?
- Any morning constraints (kids, pets, meds, shared bathroom)?
- What’s your biggest trap: snooze, phone, rushing, or late nights?
- Which 1–2 benefits matter most to you (calm, energy, focus, fitness, creativity)?
- Which template length feels realistic this week (3, 5, 15, or 30 minutes)?

You’ve got this. We’ll keep it simple, make it winnable, and build up once the tiny version is automatic.

</details>

<details>
<summary><strong>Creative</strong> (creativity ~90)</summary>

You’re not failing—you’ve just been trying to run a marathon at the starting line. Let’s build you a runway, not a wall. Think “pilot light” first (tiny, reliable), then “bonfire” when life allows.

Here’s a simple, proven way to make a morning routine stick.

Step 1: Pick your why (one word)
- Calm, Energy, Focus, or Joy.
- This is your compass. If you’re unsure, choose Energy for now.

Step 2: Build a staircase routine (floor → standard → ceiling)
- Floor = the 1–3 minute “no matter what” version. This keeps the streak alive.
- Standard = 10–15 minutes when the morning is normal.
- Ceiling = the deluxe version when you have extra time.

Example (tailor to your why)
- Floor (2 minutes):
  - Light + water: open curtains, big sip of water.
  - Move: 20–30 seconds of easy stretches.
  - Mind: 3 slow breaths while naming today’s one intention.
- Standard (12 minutes):
  - 2 min light + water
  - 5 min movement (walk, mobility, or yoga flow)
  - 3 min mind (quiet breathing or quick journal: “Today I will feel [X] by doing [Y].”)
  - 2 min plan: top 1–3 priorities
- Ceiling (20–30 minutes): longer workout, deeper journaling, reading, or creative time.

Step 3: Make it automatic with anchors
- Habit stack: After I turn off my alarm, I open curtains and drink water. After water, I stretch. After stretching, I set my intention.
- Night-before setup (2-minute “launch pad”):
  - Place a full water glass where you’ll see it.
  - Layout clothes/shoes.
  - Keep a sticky note or card with your 4 steps on your nightstand.
  - Optional: make a 3-song “Sunrise” playlist.
- Create a friction-free zone: phone on airplane mode until the floor routine is done.

Step 4: Keep it sticky
- Tiny win celebration: a fist pump, a checkmark, or saying “Win.” It trains your brain to come back.
- If-then rescue plan:
  - If I wake up late, I do only the floor routine before anything else.
  - If I travel or have guests, I do the 60-second version (light, sip, 3 breaths).
- Track simply: a calendar X, a habit app, or 5 empty boxes on a note. Aim for “never miss twice.”
- Weekly tune-up: what was the smallest snag? Fix it (earlier water prep, simpler movement, shorter playlist).

5-day mini-experiment
- Day 0 (tonight): Set up the launch pad and write your 2-minute floor on a card.
- Days 1–5: Do the floor first thing. If time allows, climb to standard.
- Each day, log: Did I complete the floor? Y/N. Energy after: 1–5. One tweak for tomorrow.
- End of Day 5: Keep what worked, cut what didn’t, and lock the new floor.

Quick templates you can copy
- Implementation intention: After I [alarm off], I will [open curtains + sip water] and then [20s stretch + 3 breaths + 1 intention].
- One-line journal prompts:
  - Today will be a win if I…
  - The kindest thing I can do for myself this morning is…
  - One small action that serves Future Me is…

You’ve already shown commitment by asking for help—that’s momentum. Let’s turn it into action tomorrow with a 2-minute floor. Want me to help you personalize it? Tell me:
- What time do you usually wake up and what are your morning constraints?
- Which word fits your why: Calm, Energy, Focus, or Joy?
- What’s the #1 spot where mornings usually derail for you?
- Which movement or mind practice actually feels good to you (even for 30–60 seconds)?

</details>

---

#### Prompt 3 — Burnout at work

**Prompt:** I'm burned out at work — where do I start?

<details>
<summary><strong>Focused</strong> (creativity ~25)</summary>

You’re not alone—burnout is real, and you can turn this around. Let’s start simple and practical.

1) Stabilize your energy (today)
- 3 micro-breaks: set a timer every 60–90 minutes, stand up, breathe 60 seconds, quick stretch.
- 10 minutes outside or a short walk.
- Protect sleep window tonight; no screens the last 30 minutes.

2) Triage your workload
- Do a 10-minute brain dump of everything on your plate.
- Label: A = must-do this week, B = important but can wait, C = nice-to-do/delegate.
- Pick your 3 Most Important Tasks (MITs) for tomorrow. Everything else gets parked.

3) Set one clear boundary
- Create two 25–50 minute focus blocks tomorrow; silence notifications.
- Status line example: “Heads down 10–11 and 2–3 to finish X. Reach me after.” 
- Practice a “no”/“not now” script: “Given X priority, I can start this next Tuesday—does that work?”

4) Re-align with your manager
- Ask for a 15-minute check-in to reprioritize.
- Script: “I want to deliver the highest-impact work. Here’s my current list. What should be top 3, and what can pause or be delegated?”

5) Add a daily shutdown ritual
- 5-minute end-of-day: capture wins, move tasks, set tomorrow’s MITs, close laptop with intention.
- Do one small joy activity (music, stretch, call a friend).

6) Get support
- Loop in a trusted coworker for cover/delegation.
- If symptoms persist or feel overwhelming, consider talking with a qualified mental health professional or using your company’s EAP. I’m a coach, not a therapist, and extra support can help.

Quick start plan for today
- 10-minute brain dump + mark A/B/C.
- Choose 3 MITs for tomorrow and block two focus windows.
- Send the manager check-in note.
- Take a 10-minute walk and a 60-second breathing break.

What’s the biggest drain right now—workload, team dynamics, unclear priorities, or something else? And do you have any flexibility to take a day or even a half-day off soon?

</details>

<details>
<summary><strong>Balanced</strong> (creativity ~50)</summary>

Burnout is heavy, and it’s also a signal—not a personal failure. You’ve already taken a strong first step by asking for help. Let’s keep it simple and doable so you can feel relief quickly.

Where to start (5 moves for the next 1–2 weeks):
1) Stabilize your energy (minimum viable self-care)
- Sleep: pick a realistic target (even +30–60 minutes helps).
- Micro-breaks: 3 times a day, take 5 minutes to breathe, stretch, or step outside.
- Food/water: one easy win (e.g., a prepared lunch or set water timer).
- Movement: 10 minutes/day (walk, light stretch).

2) Lighten the load fast
- Define a “minimum viable day”: 3 Most Important Tasks (MITs). Everything else is bonus.
- Triage your to-dos with Eliminate–Automate–Delegate. Ask: what can I drop, batch, or hand off?
- Protect 1–2 focus blocks (use calendar holds or “Do Not Disturb”).

3) Map what’s burning you vs. what fuels you
- For one week, jot down “Drainers” and “Energizers.”
- Circle the top 2–3 drainers that create most stress. Look for quick fixes (e.g., batch email twice a day, audit meetings, turn off nonessential notifications).

4) Have a clean, low-stress check-in with your manager
- Goal: clarify priorities and adjust workload, not to vent.
- Script you can use:
  “I’m committed to delivering great work. Right now I’m managing A, B, and C, which are competing. If X is the top priority, could we push B to next sprint or get support for C? Here’s a red–yellow–green view: X = red (needs help/deferral), Y = yellow (at risk), Z = green.”
- Ask for: fewer meetings, no-meeting focus blocks, deadline shifts, or help with specific tasks.

5) Create a shutdown ritual
- 10 minutes at day’s end: brain-dump open loops, pick tomorrow’s 3 MITs, tidy your space, then a clear sign-off (e.g., close laptop, short walk). This helps your brain “clock out.”

Optional 7-day reset (quick and gentle):
- Day 1: List everything on your plate. Choose your 3 MITs for tomorrow. Block 2 focus windows.
- Day 2: Meeting audit—decline or shorten what you can; move nonurgent items.
- Day 3: Templates/automation—canned email replies, checklists, or scripts for recurring tasks.
- Day 4: Environment reset—clean desk, set notification boundaries, prep easy meals/snacks.
- Day 5: Manager sync—use the script; confirm priorities and realistic timelines.
- Day 6: Full recovery block—no work. Do something restorative (walk, hobby, nap, friends).
- Day 7: Plan next week at ~70% capacity. Leave buffer for surprises.

A few mindset anchors:
- Progress over perfection: “Good enough” delivers more than “burned out perfect.”
- One spark a day: Do one small task that feels meaningful or plays to your strengths.
- You’re allowed to need capacity to do great work. That’s professionalism, not weakness.

If you want, tell me:
- Your role and typical week (hours, meetings).
- Your top 2–3 drainers.
- How supportive your manager/team is.
I can help you tailor a concrete plan and scripts.

Note: I’m a mental wellness coach, not a therapist. If your distress is intense or persistent, consider reaching out to a qualified mental health professional or your Employee Assistance Program for added support. You don’t have to carry this alone.

</details>

<details>
<summary><strong>Creative</strong> (creativity ~90)</summary>

You’re not broken—you’re a high-output engine that’s been running too hot for too long. Burnout is your system’s smoke alarm saying, “Something needs adjusting.” Let’s start simple and regain control in small, doable steps.

Quick 24-hour reset (get a tiny win today)
- Pick one thing to finish: choose the smallest, most important task and close it. Momentum beats perfection.
- Schedule two 10-minute breath-and-stretch breaks on your calendar. Box breathing: inhale 4, hold 4, exhale 4, hold 4 (repeat 4 times).
- Reduce noise: mute noncritical notifications for the next 3 hours.
- End-of-day shutdown: write tomorrow’s Top 3 and a “parking lot” for thoughts so your brain can rest.

Then, a focused 5-step plan for the week
1) Stabilize your energy (oxygen mask first)
- Sleep: aim for a consistent bedtime + wake time; even 30 minutes earlier helps.
- Fuel and water: don’t skip meals; keep a water bottle within reach.
- Micro-recoveries: every 90 minutes, stand, breathe, move for 2–3 minutes. Think of these as pit stops, not luxuries.

2) Triage the load (lighten the backpack)
- Brain-dump everything you’re carrying.
- Sort into: Must ship this week / Should do soon / Nice to do.
- Make a Stop-Doing list: what can be paused, delegated, or done at “good enough” 60%?
- Pick a Daily Big 1 and two small supporting tasks. Close those; let the rest wait.

3) Protect focus and boundaries (build a moat)
- Time-block two 60–90 minute “Do Not Book” focus windows on your calendar.
- Batch email/Slack into 2–3 windows; outside those, close the apps.
- Audit meetings: decline or ask for an async update where possible.

4) Align with your manager (shift from more to most)
Use this short script or email:
- “I want to protect quality and hit what matters most. Here’s my current list: [top items]. Based on capacity, which 2–3 should be the priority this week? For the others, which can we pause, delegate, or push back? I’m also blocking two focus windows to move the priorities faster—okay to mark those as no-meeting?”
This turns overwhelm into a shared prioritization problem, not a personal failure.

5) Refill the tank (tiny sparks daily)
- 10-minute joy break: music, sunlight walk, stretching, a call with someone energizing.
- End your day by noting 1 win, 1 thing to let go, 1 thing you’ll tackle tomorrow.
- Weekend buffer: half a day with no chores, no work, and no screens.

If you want, I can help you customize a one-week “burnout reboot” with your real tasks and schedule. To tailor it, tell me:
- What are your top 5 responsibilities right now?
- Which tasks drain you most vs. give you energy?
- How supportive is your manager/team with reprioritizing?
- Any hard deadlines this week we need to protect?

Finally, if the exhaustion feels unshakable or starts affecting your health, it could help to speak with a qualified mental health professional alongside these steps. I’m here to support your next small win—what’s one thing you could do in the next 15 minutes to create a little breathing room?

</details>

---

### ❓ Question #2

**Are the vibes of your assistant aligned with your expectations? Why or why not?**

**Answer:** Yes, mostly aligned — especially in Activity #2.

- Coaching prompts (presentation anxiety, morning routines, burnout) feel supportive, practical, and action-oriented.
- The creativity slider produces noticeably different styles: Focused = tighter checklists; Creative = more metaphor and energy while staying safe.
- Guardrails show up on the burnout prompt (coach vs therapist, EAP suggestion).
- Generic Activity #1 prompts still feel like a general assistant, which is expected.
- Persona differences are less visible than creativity differences in this write-up; session memory is still missing.

Overall, Activity #2 vibes match what I built Mindful Coach for.

---

## 🏗️ Activity #3: Capability Gaps Vibe Check

Prompts that require capabilities the app does **not** have yet: memory, live data, or external tools.

**Settings (all prompts):** Motivational Coach · Creative (~90)

---

#### Memory

**Prompt:** You helped me with burnout last time — what was the one boundary I said I was going to set with my manager?

**Response:**
I’m glad you’re back! I don’t have our previous notes in this chat, so I can’t see exactly what we landed on. Let’s rebuild it fast—was it one of these “fence around your focus” boundaries?

- No Slack/email after X pm (emergencies = call/text only)
- A protected 2-hour focus block each morning (no meetings)
- No same‑day add-ons unless something else is deprioritized
- A weekly priorities check-in to agree on the top 3
- A true lunch break away from the desk every day

If one of those rings a bell, say which and we’ll lock it in. If not, we can choose the one you need most now.

Ready-to-send script you can tweak:
- “To protect my focus and prevent burnout, I’m setting [boundary]. For true urgencies, please [alternative—call/text]. Otherwise I’ll respond/shift work [timeline]. This helps me deliver higher‑quality work consistently.”
- “When new requests come in inside [timeframe], I’ll need to trade off by moving [task] or shifting the deadline. Can we align on priorities when that happens?”

Quick next step:
1) Pick the boundary.
2) Put it in writing (email/Slack).
3) Block your calendar or set Do Not Disturb so the boundary has teeth.

Tell me which one it was (or the one you want now), and I’ll tailor the exact message with you. You’ve got this—guardrails on your energy = smoother, stronger performance.


---

#### Real-time data

**Prompt:** I have a flight from SFO tomorrow at 8:15 AM. What time should I leave my house in Oakland, and what's the traffic like right now?

**Response:**
You’ve got this—let’s reverse-engineer a calm, on-time morning.

Quick rule of thumb:
- Domestic flight: be at SFO 2 hours early (by ~6:15 AM).
- International: 3 hours early (by ~5:15 AM).

Suggested leave times from Oakland (driving or ride-share):
- Domestic: leave around 5:00 AM. If you’re parking at SFO or coming from farther up in the hills/north Oakland, push to 4:45–5:00 AM.
- International: leave around 4:00 AM. If parking, 3:45–4:00 AM.

Why: Early-morning drive time Oakland → SFO is typically 35–55 minutes. Adding 15–20 minutes for drop-off/parking and a buffer keeps stress low. Traffic on I-880 and CA-92/US-101 thickens after ~6:30 AM, so leaving by 5:00 AM for a domestic flight beats the rush.

Traffic right now:
- I can’t check live traffic from here. For the most accurate picture, pop your exact address into Google Maps or Waze with “Arrive by 6:15 AM at SFO” (domestic) or “Arrive by 5:15 AM” (international). Recheck tonight and again in the morning before you roll.
- Bay Area 511 (511.org or the 511 app) also shows incidents and travel times.

If you’re taking BART:
- Aim to reach SFO Station by ~6:00 AM (domestic) or ~5:00 AM (international). Check the BART schedule from your nearest station—first trains vary by day, and early flights can beat first departures. If the first train’s too late, plan a ride-share.

Small wins to make the morning easy:
- Check in online, screenshot your boarding pass.
- Pack and set out your outfit tonight.
- Set two alarms and schedule your ride-share in advance if using one.

If you tell me whether it’s domestic or international and how you’re getting there (drive, ride-share, or BART), I’ll dial in a precise leave time for your neighborhood.

---

#### External tools

**Prompt:** I read that a new study came out about meditation and burnout — can you summarize the latest research from this week?

**Response:**

Love that you're staying curious about the science—tracking fresh research is a power move against burnout. Quick heads-up: I don’t have live access to this week’s publications. If you can share the title or a link, I’ll happily summarize it in plain language. In the meantime, here’s the clearest picture from recent research up to late 2024, plus how to evaluate any “new” study you see this week.

What the strongest evidence says so far
- Overall impact: Mindfulness and meditation reduce burnout and stress by small-to-moderate amounts. Gains show up most in emotional exhaustion; effects on “personal accomplishment” are smaller.
- Brief works too: Short, workplace-friendly practices (5–10 minutes) can help, especially when done consistently. App-only programs work, but engagement is the make-or-break factor.
- Active controls matter: When compared to other good activities (e.g., relaxation, psychoeducation), meditation still helps, but effects are smaller than when compared to waitlists.
- Delivery: Group-based or guided programs tend to beat purely self-guided ones. Leader support boosts adherence.
- Mechanisms: Less rumination, better attentional flexibility, more self-compassion, and improved physiological regulation (e.g., HRV) seem to mediate benefits.
- Durability: Benefits often last 1–3 months; they fade without continued practice.
- Big caveat: Meditation isn’t a cure-all. It works best alongside structural fixes (workload, staffing, autonomy). It’s a personal energy charger, not a substitute for system change.

How to quickly vet “this week’s” new study
- Design: Is it randomized? What’s the control (waitlist vs active)?
- Sample: Who was studied (healthcare workers, teachers, knowledge workers) and how many?
- Measures: Did they use standard tools (e.g., Maslach Burnout Inventory or Copenhagen Burnout Inventory)?
- Follow-up: Any data beyond immediate post-intervention?
- Effect size: Look for numbers (e.g., Cohen’s d) and whether changes are clinically meaningful, not just statistically significant.
- Adherence: How often did people actually practice? Dropout rates?
- Safety: Any report of adverse effects or distress?

Want to test-drive something this week while you hunt the paper?
- 60-second box breath pit stop: Inhale 4, hold 4, exhale 4, hold 4. Do 3 rounds before meetings—think of it as washing the mental windshield.
- 3-minute “name it to tame it”: Pause midday, label what you feel (e.g., “tense, scattered”), locate it in the body, breathe into that spot for 6 slow breaths, choose one doable next step.
- 10-minute evening unwind: 2 minutes of gratitude wins from the day, 6-minute body scan, 2 minutes of self-compassion phrases (e.g., “This is tough, and I’m supporting myself right now”).

If you share the study link or title, I’ll give you a crisp, actionable summary and help translate the stats into takeaways you can use. Your curiosity is already turning the burnout dial down—let’s harness it.

---

### ❓ Question #3

**What are some limitations of your application?**

**Answer:**

Mindful Coach has several clear limitations:

1. **No session memory** — It cannot recall prior conversations (e.g., boundaries from "last time") unless full chat history is sent with each request, which is not implemented yet.
2. **No real-time data** — It cannot check live traffic, weather, or calendars. It can offer rules of thumb and point users to Maps, 511, or BART schedules instead.
3. **No external tools** — It cannot browse the web or summarize studies from "this week" without a user-provided link. Summaries rely on training data with a knowledge cutoff.
4. **Single-turn API** — Each message is largely independent; in-thread context is limited to what's in the current UI session and sent to the backend.
5. **Not clinical care** — Guardrails limit it to wellness coaching, not therapy or medical advice.

Activity #3 showed the app handles gaps best when it **states limitations honestly** (memory, live traffic, current research) and offers **actionable fallbacks** rather than guessing.

---

## 🚀 (Optional) Improve Your App

Based on the vibe check, improvements made and results:

**Adjustments made:**

1. **Coach personas + guardrails** — Added four characters (Professional, Warm friend, Mindful guide, Motivational Coach) with shared safety rules (not a therapist, crisis handling, coaching scope). Activity #2 showed coaching prompts felt aligned when using Motivational Coach.

2. **Creativity slider** — Added a Focused → Creative control that adjusts the system prompt (not temperature, since gpt-5 only supports the default). Activity #1 Prompt #3 and Activity #2 showed clearly different response styles at low vs high creativity.

3. **User-friendly errors** — Replaced raw `Request failed (500)` messages with plain-language errors on the backend and frontend. Deployment and API failures are easier to understand.

4. **Cancel in-flight requests** — Added a **Stop** button while waiting for a reply. Activity #2 responses can be long; users can cancel without seeing a false error.

5. **Vercel deployment fix** — Migrated to Vercel **services** routing so `/api/*` hits the FastAPI backend and the Next.js app serves the UI — fixing 404s on chat in production.

6. **UX polish** — Light/dark/system theme toggle and app favicon for a more finished feel.

**Results:**

**What improved**
- **Activity #2:** Coaching prompts (presentation anxiety, habits, burnout) felt supportive, practical, and on-brand with Motivational Coach at Creative (~90).
- **Activity #1 Prompt #3 & Activity #2:** Creativity slider produced noticeably different tone and length (Focused = checklists; Creative = metaphor + energy).
- **Activity #3 (External tools):** After guardrails + honest prompting, the coach clearly states when it lacks live web access and offers useful fallbacks instead of inventing studies.
- **Production:** Chat works on Vercel; errors and cancel behave as expected.

**What didn’t improve (yet)**
- **Session memory** (Activity #3): Still can’t recall “last time” or prior boundaries without sending full chat history.
- **Real-time data** (Activity #3): Leave-time estimates are heuristics; live traffic/calendar still require external apps.
- **Generic prompts** (Activity #1): OOP/math/tone tasks still read like a general assistant — expected unless we force coach persona on every request.
- **Persona contrast:** Creativity differences are clearer than character differences in the write-up; personas may need sharper prompt separation in a future iteration.

**Next steps:** Send conversation history to the API for in-session memory, add a “paste a link” flow for research summaries, and optionally stream replies for long coaching responses.

---

## 📦 Submission

| | Link |
|---|---|
| **Fork** | https://github.com/avaradharaju/The-AI-Engineer-Challenge-1 |
| **Pull request** | https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge/pull/96 |
| **Live app** | https://ai-engineering-challenge-kohl.vercel.app |
| **Health check** | https://ai-engineering-challenge-kohl.vercel.app/api/health |

**Branch:** `feat/build-ui`

**App:** Mindful Coach — AI mental wellness coaching with four personas, creativity control, and a Next.js + FastAPI stack deployed on Vercel.



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
