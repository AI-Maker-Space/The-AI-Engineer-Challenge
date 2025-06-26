# AIE Week 1 - Homework 1: Vibe Check

Advanced Build

1. GitHub URL to Markdown: [HW1_VIBE_CHECK.md](https://github.com/julie-berlin/pub-aim-the-ai-engineer-challenge/blob/main/docs/HW1_VIBE_CHECK.md)
2. Vercel URL to Updated Challenge Project: [ChattyCat](https://pub-aim-the-ai-engineer-challenge.vercel.app/)

---

## 🏗️ Activity #1:

Please evaluate your system on the following questions:

1. Explain the concept of object-oriented programming in simple terms to a complete beginner.
    - user prompt:
    ```
    Explain the concept of object-oriented programming in simple terms to a complete beginner.
    ```
    - Expected Good Answer: A short response that uses simple words to explain the main concepts.
    - Aspect Tested: Factual accuracy, style guide adherence
    - Evaluation: The answer is acceptable but the UI is not handling markdown and squished the response together. Updated the app so markdown is displayed correctly.

2. Read the following paragraph and provide a concise summary of the key points…
    - user prompt:
    ```
    Read the following paragraph and provide a concise summary of the key points:

    What If Your New Kitty Doesn't Get Along With Your Other Pets? Don't panic if you have another cat and it isn't getting along with the new kitten just yet. This process can take time, and 30 days may not be enough for your cat to adjust. This is where those synthetic calming pheromones can help all the cats in the household to adjust; they can be used as a diffuser in a room both cats spend time in, or a spray that can be used on their beds or other common areas. It can also help them bond if you make their interactions more positive by playing with both cats together, giving them treats, and/or engaging in other activities your cats enjoy, such as grooming, with the new kitten in tow.
    ```
    - Expected Good Answer: Include time frame, calming pheromones, positive reinforcement in answer.
    - Aspect Tested: Factual accuracy, hallucination resistance
    - Evaluation: The answer was concise and complete.

3. Write a short, imaginative story (100–150 words) about a robot finding friendship in an unexpected place.
    - user prompt:
    ```
    Write a short, imaginative story (100–150 words) about a Siberian Forest Cat finding friendship in an unexpected place.
    ```
    - Expected Good Answer: Make the story relevant to a cat in winter setting and perhaps in Russia.
    - Aspect Tested: Style-guide adherence, safety
    - Evaluation: Story was cute, correct length and

4. If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?
    - user prompt:
    ```
    If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?
    ```
    - Expected Good Answer: 3 packs of apples, 3 packs of oranges
    - Aspect Tested: Factual accuracy, chain-of-thought
    - Evaluation: Answer was correct and showed reasoning steps.

5. Rewrite the following paragraph in a professional, formal tone…
    - user prompt:
    ```
    Rewrite the following paragraph in a professional, formal tone:

    So here's the deal. We are way behind on containerizing the Laravel apps cause the devs don't know docker. I arranged for training but it's not til next week. Also they were each sick during the sprint and a bunch of new tickets were added but none taken away. Everything is running late and I decided we're going to focus on one thing at a time til all is caught up. I think it'll be at least 3 weeks. As long as some other firedrill doesn't happen in the meantime. LMK if you have ideas.
    ```
    - Expected Good Answer: Remove informal words and phrasing but keep main points and make them more understandable.
    - Aspect Tested: Style-guide adherence, hallucination resistance
    - Evaluation: Did a good job of rephrasing which could be used in an email or instant message communication.

---

## 🧑‍🤝‍🧑❓ Discussion Question #1:

What are some limitations of vibe checking as an evaluation tool?

**Answer:**

Vibe checking provides reassurance that the primary functionality of the application is working. It's valueable to detect major failures quickly so they can be addressed. However, it is subjective and can miss problems even in the capabilities that it tests.

Pros:

- Quickly catches major and obvious failures.
- Does not require specific expertise.
- Low effort.

Cons:

- Not comprehensive:
  - Does not cover all or even most features or possible uses.
  - Could fail to reveal issues that don't happen to show in output.
  - Biased: the vibe check is only as good as the experience of the person performing the check and will carry conscious and unconscious bias with respect to both the tests themselves and the determination of whether results are acceptable.
  - Root causes hidden: only tests the final outcome and not individual modules or components and does not necessarily provide detailed information on how or why a failure occurred.

- Performed manually:
  - Could be skipped or incomplete.
  - Should be repeated each time a change is made to a part of the stack: not scaleable and burdensome for environments with frequent changes.
  - Documentation on what criteria were used to assess and when tests passed would have to be done manually and could be skipped or inaccurately recorded.

The vibe check is an excellent way to catch major and obvious failures or misconfigurations in a proof of concept (POC) application's early stages. The vibe check should be replaced by more comprehensive automated tests for any system moving from POC to active development.
