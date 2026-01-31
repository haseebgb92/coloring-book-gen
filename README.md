# Coloring Book Gen

A professional tool for generating Amazon KDP print-ready coloring books with educational writing practice.

## Features

- **KDP-Ready**: Automatically handles trim sizes (6x9, 8x10, 8.5x11), mirrored margins, and bleeds.
- **Dotted Letterforms**: Includes automated generation of tracing exercises using dotted fonts.
- **Smart Spread Logic**: Ensures images are always on left pages and stories on right pages.
- **Template System**: Choose from various styles (Minimal, Jungle, Fairy Tale, etc.).
- **Validation**: Pre-export checks for asset matching and KDP safety.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Prepare Assets**:
    - Place your stories in a `stories.json` file.
    - Ensure your illustration filenames match the story titles (e.g., "A Brave Lion.png" for story "A Brave Lion").

4.  **Export**:
    - Follow the 7-step wizard in the app.
    - Download the final PDF and upload directly to Amazon KDP.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **PDF Engine**: jsPDF + pdf-lib
- **Styling**: Vanilla CSS (Global Design System)
- **Icons**: Lucide React
- **Celebration**: Canvas Confetti
