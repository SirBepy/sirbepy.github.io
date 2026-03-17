# AI Prompt — Project Documentation Template

Copy and paste the prompt below into any AI assistant to generate the `.portfolio-data/` files for a project.
No modifications are needed before use — the AI will ask all necessary questions before writing anything.

---

## The Prompt

````
I need your help writing the `.portfolio-data/` documentation for one of my personal projects. This folder lives in the project's own repository and contains two files:

1. `metadata.json` — structured data consumed by my portfolio site's GitHub Action at build time
2. `PORTFOLIO.md` — a free-form Markdown description shown in the project popup on the portfolio

**Important:** Do not write either file until you have asked all the questions below and I have answered them. If any of my answers are unclear or incomplete for a required field, ask a follow-up question and wait for my response before proceeding. Never fill in required fields by guessing.

---

**Questions to ask before writing:**

1. What is the project called? (the display title, not the repo name)
2. In one sentence, what does the project do? (this becomes `shortDescription` — keep it short, punchy, under 100 characters if possible)
3. What type of project is it? (e.g. Game, Web App, CLI Tool, Library, Bot, Mobile App, Script, Other — you can suggest one based on context but confirm with me)
4. What is the current status?
   - `finished` — the project is complete and won't change much
   - `in-progress` — actively being worked on
   - `abandoned` — started but left incomplete
   - `archived` — finished/done but no longer maintained
5. What programming languages did you use? (list all, e.g. TypeScript, Lua, Python)
6. What frameworks, libraries, or platforms were involved? (e.g. React, Roblox, Express, Tailwind — list all major ones)
7. Is there a live URL where people can view or use the project? If yes, what is it? If no, say null.
   (Note: the repository URL is derived automatically from GitHub visibility — do not ask for it)
8. What year did you start (or primarily work on) the project?
9. How often is / was the project used?
   - `Daily` — used every day
   - `Occasionally` — used a few times a week or month
   - `Rarely` — used only sometimes
   - `No longer used` — not in active use anymore
10. Do you have any screenshots or images for the project? If yes, list the filenames you plan to add (e.g. screenshot.png, demo.gif). Which one should be the main image shown on the card?
11. For the long description (`PORTFOLIO.md`), tell me:
    a. What is the project and what problem does it solve?
    b. How was it built — what were the key technical decisions or interesting parts?
    c. Who is it for / what is it used for?
    d. How often is it actually used in practice, and by whom?
    e. What is its current state — is it finished, still growing, on hold?
    f. Anything else notable — challenges you faced, what you learned, what you'd do differently?

---

Once I have answered all your questions (and you have asked follow-ups for any unclear or missing required fields), produce the two files:

**File 1: `metadata.json`**

Use this exact schema. All fields are required:

- `title` — display name of the project (string)
- `shortDescription` — one sentence, under 100 chars ideally (string)
- `type` — free text e.g. Game, Web App, CLI Tool, Library, Bot, Script (string)
- `status` — must be exactly one of: `"finished"` | `"in-progress"` | `"abandoned"` | `"archived"`
- `languages` — array of language name strings, e.g. `["TypeScript", "Lua"]`
- `frameworks` — array of framework/library/platform name strings
- `liveUrl` — string URL, or `null` if none
- `mainImage` — image filename string e.g. `"screenshot.png"`, or `null` if no images
- `images` — array of image filename strings; empty array if none
- `usageFrequency` — must be exactly one of: `"Daily"` | `"Occasionally"` | `"Rarely"` | `"No longer used"`
- `year` — integer year, e.g. `2025`

Note: `repoUrl` is NOT part of this file. It is derived automatically by the portfolio's ingestion script based on whether the repository is public or private.

**File 2: `PORTFOLIO.md`**

Write a well-structured Markdown document. Use headings. Cover all of the following:
- What the project is and what it does
- How it was built (key tech decisions, architecture highlights, anything technically interesting)
- What it's used for and who uses it
- How often it's used / current activity level
- Current status and future plans (if any)
- Anything notable — interesting challenges, lessons learned, things worth calling out

Keep the tone clear and direct — this will be read by developers, recruiters, and curious visitors. Aim for 200–500 words. Do not pad it out; write as much as the project genuinely warrants.

---

Present both files in separate code blocks, ready to copy.
````

---

## Usage Notes

- Place `metadata.json` and `PORTFOLIO.md` in a `.portfolio-data/` folder at the root of the project repo.
- Image files referenced in `metadata.json` should also be placed in `.portfolio-data/` (e.g. `.portfolio-data/screenshot.png`).
- The portfolio's GitHub Action picks up `.portfolio-data/` automatically on every deploy — no changes needed in the portfolio repo.
- `repoUrl` is intentionally absent from `metadata.json`. The ingestion script sets it automatically: public repos get their GitHub URL, private repos get `null`.
