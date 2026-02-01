import { TemplateConfig } from './types';

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        fonts: { heading: 'Outfit', body: 'Inter', tracing: 'Codystar' },
        colors: {
            background: '#ffffff',
            heading: '#111827',
            storyText: '#374151',
            tracing: '#9ca3af',
            writingLine: '#e5e7eb',
            border: '#000000',
            accent: '#000000',
            pageNumber: '#6b7280',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 12,
            showIcon: true,
            iconSet: 'geometric',
            headingSize: 28,
            bodySize: 14
        },
    },
    {
        id: 'bubblegum-fun',
        name: 'Bubblegum Fun',
        fonts: { heading: 'Bubblegum Sans', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#fff1f2',
            heading: '#be123c',
            storyText: '#fb7185',
            tracing: '#fda4af',
            writingLine: '#fee2e2',
            border: '#f43f5e',
            accent: '#fb7185',
            pageNumber: '#e11d48',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 32,
            showIcon: true,
            iconSet: 'hearts',
            headingSize: 38,
            bodySize: 18
        },
    },
    {
        id: 'sketchbook-story',
        name: 'Sketchbook Story',
        fonts: { heading: 'Architects Daughter', body: 'Andika', tracing: 'Codystar' },
        colors: {
            background: '#fafaf9',
            heading: '#44403c',
            storyText: '#78716c',
            tracing: '#d6d3d1',
            writingLine: '#f5f5f4',
            border: '#78716c',
            accent: '#a8a29e',
            pageNumber: '#57534e',
        },
        layout: {
            borderStyle: 'dashed',
            cornerRadius: 8,
            showIcon: true,
            iconSet: 'clouds',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'ocean-explorer',
        name: 'Ocean Explorer',
        fonts: { heading: 'Comfortaa', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#f0f9ff',
            heading: '#075985',
            storyText: '#0c4a6e',
            tracing: '#7dd3fc',
            writingLine: '#e0f2fe',
            border: '#0ea5e9',
            accent: '#38bdf8',
            pageNumber: '#0369a1',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 40,
            showIcon: true,
            iconSet: 'ocean',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'music-melodies',
        name: 'Music Melodies',
        fonts: { heading: 'Indie Flower', body: 'Andika', tracing: 'Codystar' },
        colors: {
            background: '#fefce8',
            heading: '#854d0e',
            storyText: '#a16207',
            tracing: '#fef08a',
            writingLine: '#fef9c3',
            border: '#ca8a04',
            accent: '#eab308',
            pageNumber: '#a16207',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 15,
            showIcon: true,
            iconSet: 'music',
            headingSize: 36,
            bodySize: 17
        },
    },
    {
        id: 'galactic-voyage',
        name: 'Galactic Voyage',
        fonts: { heading: 'Orbitron', body: 'Exo 2', tracing: 'Codystar' },
        colors: {
            background: '#1e1b4b',
            heading: '#a5b4fc',
            storyText: '#c7d2fe',
            tracing: '#4338ca',
            writingLine: '#312e81',
            border: '#818cf8',
            accent: '#6366f1',
            pageNumber: '#a5b4fc',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 12,
            showIcon: true,
            iconSet: 'stars',
            headingSize: 30,
            bodySize: 14
        },
    },
    {
        id: 'winter-sparkle',
        name: 'Winter Sparkle',
        fonts: { heading: 'Comfortaa', body: 'Inter', tracing: 'Codystar' },
        colors: {
            background: '#f8fafc',
            heading: '#0ea5e9',
            storyText: '#334155',
            tracing: '#94a3b8',
            writingLine: '#e2e8f0',
            border: '#38bdf8',
            accent: '#7dd3fc',
            pageNumber: '#475569',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'winter',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'forest-fable',
        name: 'Forest Fable',
        fonts: { heading: 'Architects Daughter', body: 'Andika', tracing: 'Codystar' },
        colors: {
            background: '#f0fdf4',
            heading: '#166534',
            storyText: '#14532d',
            tracing: '#86efac',
            writingLine: '#dcfce7',
            border: '#166534',
            accent: '#22c55e',
            pageNumber: '#15803d',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 20,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 34,
            bodySize: 16
        },
    },
];

export const INITIAL_PROJECT_STATE: any = {
    printSettings: {
        trimSize: '8.5x11',
        bleed: false,
        margins: { top: 0.5, bottom: 0.75, inner: 0.75, outer: 0.5 },
        flatten: false,
        pageNumbers: {
            enabled: true,
            startFrom: 'scenes',
            position: 'bottom-outer',
            style: 'simple',
            size: 'M'
        }
    },
    writingSettings: {
        minRepetitions: 3,
        guidelines: { showTop: true, showMid: true, showBase: true },
        spacingScale: 1.0,
        practiceFontSize: 28
    }
};
