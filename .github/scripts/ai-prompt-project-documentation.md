# AI Prompt — Project Documentation Template

Copy and paste the prompt below into any AI assistant to generate the `.portfolio-data/` files for a project.
No modifications are needed before use — the AI will ask clarifying questions first.

---

## The Prompt

```
I need your help writing the `.portfolio-data/` documentation for one of my personal projects. This folder lives in the project's own repository and contains two files:

1. `metadata.json` — structured data consumed by my portfolio site's GitHub Action at build time
2. `PORTFOLIO.md` — a free-form Markdown description shown in the project popup on the portfolio

Before writing anything, please ask me the following questions. Do not guess or assume any answers — if you're missing information, ask.

---

**Questions to ask before writing:**

1. What is the project called? (the display title, not the repo name)
2. In one sentence, what does the project do? (this becomes `shortDescription` — keep it short, punchy, under 100 characters if possible)
3. What type of project is it? (e.g. Game, Web App, CLI Tool, Library, Bot, Mobile App, Script, Other — you can suggest one based on context)
4. What is the current status?
   - `finished` — the project is complete and won't change much
   - `in-progress` — actively being worked on
   - `abandoned` — started but left incomplete
   - `archived` — finished/done but no longer maintained
5. What programming languages did you use? (list all, e.g. TypeScript, Lua, Python)
6. What frameworks, libraries, or platforms were involved? (e.g. React, Roblox, Express, Tailwind — list all major ones)
7. Is there a live URL where people can view or use the project? If yes, what is it? If no, say null.
8. Is the repository public? If yes, what is the GitHub repo URL? If no, say null.
9. What year did you start (or primarily work on) the project?
10. How often is / was the project used?
    - `Daily` — used every day
    - `Occasionally` — used a few times a week or month
    - `Rarely` — used only sometimes
    - `No longer used` — not in active use anymore
11. Do you have any screenshots or images for the project? If yes, list the filenames you plan to add (e.g. screenshot.png, demo.gif). One of them should be the "main" image shown on the card — which one?
12. For the long description (`PORTFOLIO.md`), tell me:
    a. What is the project and what problem does it solve?
    b. How was it built — what were the key technical decisions or interesting parts?
    c. Who is it for / what is it used for?
    d. How often is it actually used in practice, and by whom?
    e. What is its current state — is it finished, still growing, on hold?
    f. Anything else notable — challenges you faced, what you learned, what you'd do differently?

---

Once I answer all your questions, produce the two files:

**File 1: `metadata.json`**

Use this exact schema. All fields are required unless noted:

```json
{
  "title": "string — display name of the project",
  "shortDescription": "string — one sentence, under 100 chars ideally",
  "type": "string — free text e.g. Game, Web App, CLI Tool, Library, Bot, Script",
  "status": "one of: finished | in-progress | abandoned | archived",
  "languages": ["array of language name strings, e.g. TypeScript, Lua, Python"],
  "frameworks": ["array of framework/library/platform name strings"],
  "liveUrl": "string URL or null if none",
  "repoUrl": "string GitHub URL or null if private/not applicable",
  "mainImage": "filename string e.g. screenshot.png, or null if no images",
  "images": ["array of image filename strings — empty array if none"],
  "usageFrequency": "one of: Daily | Occasionally | Rarely | No longer used",
  "year": 2025
}
```

**Valid enum values (exact strings, case-sensitive):**
- `status`: `"finished"` | `"in-progress"` | `"abandoned"` | `"archived"`
- `usageFrequency`: `"Daily"` | `"Occasionally"` | `"Rarely"` | `"No longer used"`

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

Present both files in separate code blocks, ready to copy. If any of my answers were ambiguous, note what assumption you made and why.
```

---

## Usage Notes

- Place `metadata.json` and `PORTFOLIO.md` in a `.portfolio-data/` folder at the root of the project repo.
- Image files referenced in `metadata.json` should also be placed in `.portfolio-data/` (e.g. `.portfolio-data/screenshot.png`).
- The portfolio's GitHub Action picks up `.portfolio-data/` automatically on every deploy — no changes needed in the portfolio repo.
- `repoUrl` in `metadata.json` is only for the portfolio display. Leaving it `null` for private repos is fine and expected.
