# AIE Week 1 - Homework 1: Vibe Check

Advanced Build

1. GitHub URL to Markdown: []()
2. Vercel URL to Updated Challenge Project: []()

---

## 🏗️ Activity #1:

Please evaluate your system on the following questions:

1. Explain the concept of object-oriented programming in simple terms to a complete beginner.
    - Expected Good Answer: A short response that uses simple words to explain the main concepts.
    - Aspect Tested: Factual accuracy and style guide adherence
    - Evaluation: The answer is acceptable

2. Read the following paragraph and provide a concise summary of the key points:
```
```
    - Expected Good Answer:
    - Aspect Tested:
    - Evaluation:

3. Write a short, imaginative story (100–150 words) about a robot finding friendship in an unexpected place.
    - Aspect Tested:
    - Evaluation:

4. If a store sells apples in packs of 4 and oranges in packs of 3, how many packs of each do I need to buy to get exactly 12 apples and 9 oranges?
    - Aspect Tested:
    - Evaluation:

5. Rewrite the following paragraph in a professional, formal tone…
```
```
    - Expected Good Answer:
    - Aspect Tested:
    - Evaluation:

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
