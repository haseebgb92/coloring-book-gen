
Actual output must use **dotted letterforms**, not plain text.

---

## PAGINATION RULES (CRITICAL)

- Image pages must always be **LEFT pages**
- Story pages must always be **RIGHT pages**
- Front matter pages may be single-page
- If front matter ends on a right page:
  - Automatically insert a blank left page before story content
- Never allow:
  - Story page without its image page
  - Broken spreads

---

## INPUT DATA MODEL

### Story Fields
Each story must support:
- `order` (number)
- `title` (string)
- `story_text` (string)
- `writing_words` (array of 4–5 strings)
- `lesson` (optional string)

### Illustration Matching
- Illustration filename must match story title
- Matching must be tolerant of:
  - Case differences
  - Spaces vs underscores
  - Hyphens
- If missing:
  - Show validation error
  - Block PDF export until resolved

### Supported Image Formats
- PNG
- JPG
- JPEG
- WEBP

---

## TEMPLATE SYSTEM

Templates define:
- Fonts
- Borders
- Decorative elements
- Spacing
- Page numbering style

### Built-In Templates (Minimum)
1. Minimal Clean
2. Bedtime Cozy
3. Jungle Adventure
4. Ocean Friends
5. Fairy Tale
6. Neutral / Calm (Islamic-friendly design without religious text)

### Template Customization Options
- Font selection (curated list)
- Heading size (S / M / L)
- Body text size (S / M / L)
- Border on/off
- Page numbers on/off
- Image fit: contain / cover

Templates MUST NOT change:
- Page order
- Left/right logic
- Writing practice structure

---

## AMAZON KDP SIZE PRESETS (INCHES ONLY)

Display and use both **Trim Size** and **After-Trim Size (Bleed)**.

### Required Presets

#### 6 × 9 in (Trim)
- After-Trim (Bleed): **6.25 × 9.25 in**

#### 8 × 10 in (Trim)
- After-Trim (Bleed): **8.25 × 10.25 in**

#### 8.5 × 11 in (Trim)
- After-Trim (Bleed): **8.75 × 11.25 in**

---

## BLEED & MARGIN RULES

### Bleed
- Bleed = 0.125 in on all outer edges
- Toggle: ON / OFF
- Strongly recommend bleed if:
  - Page backgrounds
  - Borders touch edges

### Safe Zone (MANDATORY)
Inside Trim Size:
- No text or critical elements closer than **0.375 in** to any edge

### Default Margins (Inside Trim)
- Inner (binding): 0.75 in (8.5×11 may use 0.875)
- Outer: 0.5 in
- Top: 0.5 in
- Bottom: 0.75 in

Warn user if unsafe overrides are attempted.

---

## FRONT MATTER GENERATOR (OPTIONAL)

Selectable pages:
- Title Page
- Copyright Page
- Dedication Page
- About This Book
- How to Use This Book
- Table of Contents
- Note to Parents / Teachers

Rules:
- All pages must follow selected template
- Editable text
- Reorderable
- Optional inclusion

---

## ENDING PAGES GENERATOR (OPTIONAL)

Selectable pages:
- The End / Closing Message
- Review Request (Amazon-safe wording)
- Other Books by the Author
- Reader Resources
- Notes Pages
- “I Finished This Book” Certificate

Rules:
- Editable
- Reorderable
- Template-consistent styling

---

## PDF GENERATION REQUIREMENTS

- Generate a **single interior PDF**
- Fonts must be embedded
- Images optimized for print
- Support up to **250 pages**
- Show:
  - Preview (thumbnail or page viewer)
  - Progress indicator
- Block export if validation fails

### Recommended Tech
- Next.js (TypeScript)
- Serverless PDF generation
- Avoid heavy headless browsers unless required
- Deterministic layout rendering

---

## UI FLOW

1. Create Project
2. Import Stories & Images
3. Template & Size Selection
4. Front Matter Setup
5. Story Order & Validation
6. Ending Pages Setup
7. Preview & Export PDF

Autosave project state and allow export/import as JSON.

---

## VALIDATION CHECKS (REQUIRED)

Before export:
- Every story has:
  - Illustration
  - 4–5 writing words
- Left/right page pairing is intact
- Safe zones respected
- No missing or duplicate titles

---

## FINAL INTENT

This tool must produce:
- Calm, beautiful, child-friendly books
- Print-safe Amazon KDP interiors
- Consistent educational structure
- Zero layout surprises

Correctness, print safety, and consistency are more important than speed.

---

## DELIVERABLES

1. Complete Next.js project (TypeScript)
2. Template system
3. PDF generation engine
4. Sample stories.json
5. README with setup and deployment steps
6. Vercel-ready configuration
