# Build: Coloring Activity Book Builder (Story + Tracing Words) — Vercel App (Tailwind UI)
## INPUT = Plain Text (ChatGPT-formatted) + Images | Modern Trendy UI | PDF Export + Flatten Option

You are a senior full-stack engineer, PDF publishing specialist, and UI/UX designer.

Build a production-ready web application hosted on **Vercel** to create a **complete Coloring Activity Book** (Amazon KDP interior PDF) using:
- **Plain text pasted from ChatGPT** (already formatted)
- Uploaded illustrations
- Beautiful templates
- KDP-safe print settings (trim/bleed/margins/safe zone)
- Modern, trendy UI using **Tailwind CSS**
- Real-time preview and export of a **single PDF** with embedded fonts and images
- Optional **flatten PDF** output

This is a greenfield build. Do not depend on any prior codebase.

---

## 0) Key Requirements Summary

- **Input method:** user pastes formatted text (no JSON/csv import)
- **Scene layout:** LEFT = story+words, RIGHT = illustration
- **Words practice:** 4–5 words; dotted tracing; repeated ≥3 times each; writing lines with guides
- **Templates:** distinct, beautiful, customizable; color controls for all page elements
- **UI:** left sidebar accordion; right real-time preview pane; Tailwind CSS modern UI
- **Export:** print-ready PDF with embedded fonts & images; optional page numbers; optional flattening
- **Print compliance:** inches only, KDP safe zones, bleed/margins

---

## 1) Plain Text Input Format (MANDATORY)

The user will paste multiple scenes as **plain text**, pre-formatted by ChatGPT.
The tool must parse scenes from the pasted text.

### 1.1 Required Scene Block Format
The user will paste repeating blocks in this exact structure (with headings):

Scene Title: <title text>
Story:
<one or more lines of story text>
Words:
- word1
- word2
- word3
- word4
- word5 (optional)
Illustration: <filename optional>

### 1.2 Parsing Rules
- A scene starts at line beginning with: `Scene Title:`
- The story text starts after `Story:` until `Words:` is found
- Words must be parsed from bullet lines beginning with `-`
- Illustration line is optional:
  - `Illustration:` can contain a filename hint
  - If missing, user will upload/select manually
- Ignore blank lines between sections
- If any required fields are missing (title/story/≥4 words), show errors and block export

### 1.3 UI for Pasted Input
- A large “Paste Scenes” text area
- A “Parse Scenes” button
- After parsing, show:
  - A scene list with titles
  - Per-scene editor to tweak title/story/words
  - Illustration upload/mapping per scene

No JSON import/export is required for scenes.  
(However, you may optionally allow project export/import as JSON internally for saving/restoring projects.)

---

## 2) Fixed Book Layout Rules (Mandatory)

### 2.1 Book Sequence
1) Front Matter (optional; user-selected; user-ordered)
2) Scene Spreads (parsed order; user can reorder)
3) Ending Pages (optional; user-selected; user-ordered)

### 2.2 Scene Spread Layout (Strict)
Each scene is a 2-page spread:

- LEFT PAGE: Heading + Story + Tracing Words
- RIGHT PAGE: Full-page Illustration (coloring page)

Provide an Advanced toggle: “Swap Left/Right” (off by default).

### 2.3 Tracing Words Block (Mandatory)
On LEFT page below the story:

- Words per scene: 4–5 (setting; default 4)
- Repetitions per word: minimum 3 (setting; default 3)
- Each word on a separate writing line
- Each word repeated in dotted tracing style at least 3 times
- Writing guides:
  - baseline + midline (topline optional)
- Large spacing and child-friendly proportions

### 2.4 Pagination Alignment
- First scene must start on a LEFT page
- If front matter ends on a RIGHT page, insert a blank LEFT page
- Never break spreads

---

## 3) Amazon KDP Print Settings (Inches Only)

### 3.1 Required Trim Presets
Show both Trim Size and After-Trim (Bleed ON):

1) Trim: 6 × 9 in → After-Trim: 6.25 × 9.25 in
2) Trim: 8 × 10 in → After-Trim: 8.25 × 10.25 in
3) Trim: 8.5 × 11 in → After-Trim: 8.75 × 11.25 in

### 3.2 Bleed Toggle
- Bleed adds 0.125 in each outer edge
- Toggle ON/OFF
- If any background/border reaches edges, recommend Bleed ON

### 3.3 Safe Zone (Mandatory)
Inside Trim:
- No text or critical elements closer than 0.375 in to any edge

### 3.4 Default Margins (Inside Trim)
- Inner: 0.75 in (8.5×11 can use 0.875 preset)
- Outer: 0.5 in
- Top: 0.5 in
- Bottom: 0.75 in
Allow overrides with warnings.

---

## 4) Templates & Full Color Customization

### 4.1 Built-in Templates (Minimum 8)
1) Minimal Clean
2) Bedtime Cozy
3) Jungle Adventure
4) Ocean Friends
5) Fairy Tale
6) Space Explorer
7) Rainbow Playroom
8) Calm Neutral

### 4.2 Template Tokens
Design templates using tokens so they are easy to extend:
- fontFamilyHeading / fontFamilyBody / fontFamilyTracing
- headingSize, bodySize, tracingSize
- borderStyle, cornerRadius, iconSet
- spacingScale
- colorPalette defaults

### 4.3 Color Customization (MANDATORY)
User must be able to customize colors for all key elements:
- Page background color
- Heading color
- Story text color
- Tracing dotted color
- Writing line color
- Border color
- Accent color (icons/dividers)
- Page number color

Add:
- Preset palettes per template
- Custom color picker per token
- “Reset to template defaults”

---

## 5) Front Matter (Text + Images)

Front matter pages must support text and optional images, using the same template styling.

Selectable pages:
- Title Page (text + optional image)
- Copyright Page
- Dedication
- About This Book
- How to Use This Book
- Note to Parents / Teachers
- Table of Contents (optional; auto from scene titles)

Front matter editor must allow:
- Rich text (basic formatting)
- Image upload per page
- Image placement: top/center/bottom, contain/cover
- Reorder pages

---

## 6) Ending Pages

Selectable pages:
- Closing Message (“The End”)
- Review Request (Amazon-safe wording)
- Other Books by the Author (list input)
- Notes Pages (lined; choose count)
- Certificate page (“I finished this book”)
- Reader Resources (optional; QR placeholder allowed)

All must be template-consistent and editable.

---

## 7) Modern Tailwind UI (Mandatory)

### 7.1 Layout
- Left sidebar accordion controls (sticky)
- Right pane: real-time preview viewer
- Use Tailwind CSS + modern components styling:
  - rounded-2xl cards
  - subtle shadows
  - clean spacing
  - tasteful animations (optional)
- Desktop-first, responsive second

### 7.2 Left Sidebar Accordion Sections (In this order)
Each section shows status: ✔ ready / ⚠ warning / ✖ error.

1) Project
2) Paste Scenes (plain text input + parse)
3) Scenes (list + reorder + per-scene editor + illustration upload)
4) Print Settings (trim/bleed/margins/safe zones)
5) Template (template selection + typography)
6) Colors (all token color pickers + palettes)
7) Writing Practice (words count, repetitions, guides, spacing)
8) Front Matter (pages + editor + images)
9) Ending Pages (pages + editor)
10) Page Numbers & Export Settings
11) Validation
12) Export

### 7.3 Right Preview Pane
- Page viewer with:
  - next/prev
  - thumbnail strip (toggle)
  - zoom controls
  - fit-to-width / fit-to-height
  - overlays toggle: show trim / bleed / safe zone
- Real-time updates (debounced)
- Highlight current spread (left/right pair)

---

## 8) Page Numbers & Export Settings

### 8.1 Page Number Controls
- Toggle ON/OFF
- Start page number:
  - option: start after front matter OR include front matter
- Position:
  - bottom center
  - bottom outer (recommended for books)
- Style:
  - font size S/M/L
  - color (via token)
  - optional divider line above number

### 8.2 Export Options
- Export format: PDF
- Quality preset:
  - Standard
  - High (larger file)
- Image scaling method:
  - contain/cover
  - per-template default + per-scene override

### 8.3 Flatten PDF (MANDATORY OPTION)
Add a toggle: **Flatten PDF**
- When ON:
  - Output should be flattened to reduce editability (best-effort)
  - Rasterize pages to high-quality images inside PDF OR convert text to outlines if feasible
  - Keep resolution print-friendly (do not produce blurry output)
- When OFF:
  - Keep text as text with embedded fonts

Explain in UI:
- Flatten ON reduces editability but may increase file size.
- Flatten OFF keeps selectable text.

Implement flattening in a reliable serverless-compatible manner.

---

## 9) PDF Generation Requirements (Critical)

- Single interior PDF
- Correct trim/bleed sizes in inches
- Embedded fonts
- Correct left/right page pairing
- High-quality illustrations (line art preserved)
- Supports up to 250 pages
- Export blocked if validation errors

Recommended approach:
- Deterministic renderer (e.g., @react-pdf/renderer or pdf-lib)
- Avoid headless Chromium unless required
- If rasterizing for flatten:
  - render pages at print-appropriate resolution
  - preserve crisp lines

---

## 10) Validation (Block Export on Errors)

Hard errors:
- Missing title/story for any scene
- Missing illustration for any scene
- Less than 4 words in Words section
- Repetitions < 3
- Safe zone violations
- Broken page pairing

Warnings:
- Story too long (overflow risk)
- Low-resolution images
- Blank alignment page inserted

Provide “click to fix” links that take the user to the relevant accordion section.

---

## 11) Tech Stack & Deployment

- Next.js (TypeScript)
- Tailwind CSS
- Vercel deployment ready
- Serverless PDF generation route
- Autosave project state in localStorage
- Optional: project export/import as JSON file for saving work

Deliver:
- README
- Example paste text (sample scenes format)
- Sample assets guidance

---

## 12) Acceptance Criteria

- I paste ChatGPT-formatted text and the app parses scenes correctly.
- I upload illustrations and map them to scenes.
- Scenes render as:
  - LEFT: title + story + tracing words (dotted, repeated ≥3)
  - RIGHT: full illustration page
- Templates look modern, distinct, and printable.
- I can customize colors for all page elements.
- I can enable page numbers and control start/position/style.
- I can export a print-ready PDF with embedded fonts and images.
- I can optionally flatten the PDF.
- UI is modern with left accordion sidebar and real-time preview.

---

## 13) Deliverables

1) Full Next.js TypeScript project
2) Tailwind CSS modern UI with accordion sidebar
3) Plain text parser + scene editor
4) Template system (≥8 templates) + tokenized color customization
5) Front matter + ending pages with text+image support
6) PDF export pipeline with page numbers and flatten option
7) Validation system + real-time preview
8) README + sample input text
