# Coloring Activity Book Builder

Build a production-ready coloring book for Amazon KDP using Next.js, Tailwind CSS, and @react-pdf/renderer.

## Features
- **Plain Text Input**: Paste script from ChatGPT to auto-generate scenes.
- **Scene Editor**: Customize title, story, words, and illustrations.
- **Templates**: Choose from beautiful pre-built styles.
- **Print Settings**: Validate trim size, bleed, and margins for KDP.
- **PDF Export**: Generate print-ready PDF with embedded fonts.
- **Real-Time Preview**: See your book as you edit.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Sample Input Format

Copy and paste this into the "Paste Scenes" tab:

```text
Scene Title: The Magic Garden
Story:
The sun shines on the flowers.
The bees buzz around the hive.
Words:
- sun
- flower
- bee
- buzz
Illustration: garden_scene.png

Scene Title: Ocean Friends
Story:
A little fish swims in the blue sea.
He meets a friendly crab.
Words:
- fish
- swim
- blue
- crab
```

## Architecture
- **Next.js 16 (App Router)** via Turbopack/Webpack
- **Tailwind CSS** for UI
- **Zustand** for state management (with localStorage persistence)
- **@react-pdf/renderer** for PDF generation
- **Lucide React** for icons
