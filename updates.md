# MODIFY EXISTING APP: Word Searches → Story Coloring Book Compiler

You are modifying an **existing Word Searches Generator web app** **new product mode: Story-Based Coloring Books for Ages 2–7**.

This is NOT a greenfield build.

You must:
- Reuse the existing app structure
- Reuse the sidebar, templates system, sizing system, and PDF pipeline
- Replace word-search-specific logic with story + coloring logic
- Preserve the professional UX and reliability of the original app

---

## 1. CORE APP MODE CHANGE

Add a **Book Type Selector** at the top of the app:

- Word Search Book (existing)
- Story Coloring Book (NEW)

When **Story Coloring Book** is selected:
- Hide all word-search-specific options
- Show coloring-book-specific options only
- Reuse shared systems where possible

---

## 2. FEATURES TO KEEP FROM WORD SEARCHES APP (REUSE)

Keep these systems intact:

- Left sidebar accordion UI
- Project setup flow
- Page size presets (KDP sizes)
- Bleed & margin logic
- Safe zone validation
- Template system (fonts, borders, spacing)
- Front matter generator framework
- Ending pages framework
- PDF generation pipeline
- Preview & export flow
- Validation & warnings panel
- Autosave + project JSON export/import

These systems should be **extended**, not rewritten.

---

## 3. FEATURES TO REMOVE / DISABLE (WHEN IN COLORING MODE)

When **Story Coloring Book mode** is active, disable or hide:

- Word grid generation
- Word placement algorithms
- Difficulty selectors (easy/medium/hard)
- Randomization logic
- Word lists for puzzles
- Puzzle solution pages
- Puzzle numbering logic

---

## 4. NEW DATA MODEL (REPLACES WORD SEARCH CONTENT)

Replace word-search puzzle items with **Story Items**.

### Story Item Structure
Each story item must include:

- `order` (number)
- `title` (string)
- `story_text` (string)
- `writing_words` (array of 4–5 strings)
- `lesson` (optional)

This replaces:
- word lists
- puzzle metadata

---

## 5. STORY FORMATTING RULES (CRITICAL)

Each story item generates a **2-page spread** with a FIXED structure.

### Page Pairing Logic
- LEFT page = Coloring Illustration
- RIGHT page = Story + Writing Practice

This pairing is mandatory and must never break.

---

## 6. ILLUSTRATION HANDLING (MODIFY IMAGE LOGIC)

Reuse the existing image upload system, but change behavior:

- Each illustration image file must match the **story title**
- Matching must be tolerant:
  - case-insensitive
  - spaces vs underscores
  - hyphens
- Show mapping status per story:
  - matched ✔
  - missing ✖
- Allow manual remapping if needed
- Block PDF export if any illustration is missing

Supported formats:
- PNG
- JPG
- JPEG
- WEBP

---

## 7. STORY PAGE FORMATTING (RIGHT PAGE)

Replace word-search page renderer with the following layout:

### A) Story Title
- Template-controlled heading style
- Clear, readable font
- Top of page

### B) Story Text
- Short paragraphs
- Calm, positive tone
- Age-appropriate language
- One lesson per story

### C) Writing Practice Section (MANDATORY)

Placed **below story text**.

#### Writing Practice Layout
- 4–5 vocabulary words per story
- Each word on its own line
- Each word repeated **at least 3 times**
- Use **dotted tracing letterforms**
- Include handwriting guides:
  - baseline
  - midline
- Large spacing for crayons/pencils
- No cursive fonts

This replaces:
- puzzle grids
- clue lists
- solution pages

---

## 8. COLORING PAGE FORMATTING (LEFT PAGE)

Replace puzzle grid page with:

- Full-page illustration
- No text
- Respect margins and safe zones
- Template may control:
  - borders
  - background
  - image fit (contain / cover)

No overlays on the illustration itself.

---

## 9. PAGE ORDER & PAGINATION RULES

Reuse existing pagination engine, but modify logic:

- Story content must always start on a LEFT page
- If front matter ends on a RIGHT page:
  - Insert a blank LEFT page automatically
- Never allow:
  - a story page without its illustration page
  - broken spreads

---

## 10. TEMPLATE SYSTEM MODIFICATIONS

Reuse existing templates but extend them to support:

- Story text block
- Writing practice block
- Dotted tracing font styles
- Illustration-only pages

Templates MAY customize:
- Fonts
- Borders
- Decorative elements
- Spacing
- Page numbers

Templates MUST NOT change:
- Page pairing
- Story formatting order
- Writing practice structure

---

## 11. SIDEBAR OPTION MODIFICATIONS

Modify existing sidebar sections:

### Replace:
- “Word List”
- “Puzzle Settings”
- “Difficulty”

### With:
- Story Manager
- Writing Practice Settings
- Illustration Mapping

Add controls for:
- Words per story (4–5)
- Repetitions per word (min 3)
- Tracing font style
- Writing line spacing

---

## 12. FRONT MATTER & ENDING PAGES (REUSE + EXTEND)

Reuse existing system but adjust defaults for coloring books:

Front matter options:
- Title Page
- Copyright
- Dedication
- About This Book
- How to Use This Book
- Note to Parents / Teachers

Ending pages:
- Closing Message
- Review Request (Amazon-safe)
- Other Books
- Notes Pages
- Certificate Page

All pages must follow selected template styles.

---

## 13. KDP SIZE SYSTEM (UNCHANGED)

Reuse existing size presets:

- 6 × 9 → After-Trim: 6.25 × 9.25
- 8 × 10 → After-Trim: 8.25 × 10.25
- 8.5 × 11 → After-Trim: 8.75 × 11.2
