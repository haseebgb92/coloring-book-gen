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
            iconOpacity: 0.15,
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
            iconOpacity: 0.2,
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
            iconOpacity: 0.25,
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
            iconOpacity: 0.2,
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
            iconOpacity: 0.15,
            headingSize: 36,
            bodySize: 17
        },
    },
    {
        id: 'galactic-voyage',
        name: 'Galactic Voyage',
        fonts: { heading: 'Orbitron', body: 'Exo 2', tracing: 'Codystar' },
        colors: {
            background: '#f5f3ff', // Lightened from deep indigo
            heading: '#4338ca',
            storyText: '#3730a3',
            tracing: '#c4b5fd',
            writingLine: '#ede9fe',
            border: '#818cf8',
            accent: '#6366f1',
            pageNumber: '#4338ca',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 12,
            showIcon: true,
            iconSet: 'stars',
            iconOpacity: 0.2,
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
            iconOpacity: 0.15,
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
            iconOpacity: 0.15,
            headingSize: 34,
            bodySize: 16
        },
    },
    {
        id: 'sunshine-joy',
        name: 'Sunshine Joy',
        fonts: { heading: 'Outfit', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#fffbeb',
            heading: '#92400e',
            storyText: '#b45309',
            tracing: '#fde68a',
            writingLine: '#fef3c7',
            border: '#f59e0b',
            accent: '#fbbf24',
            pageNumber: '#92400e',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'sun',
            iconOpacity: 0.25,
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'spring-butterfly',
        name: 'Spring Butterfly',
        fonts: { heading: 'Bubblegum Sans', body: 'Indie Flower', tracing: 'Codystar' },
        colors: {
            background: '#fdf4ff',
            heading: '#701a75',
            storyText: '#86198f',
            tracing: '#f5d0fe',
            writingLine: '#fae8ff',
            border: '#d946ef',
            accent: '#f0abfc',
            pageNumber: '#701a75',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 30,
            showIcon: true,
            iconSet: 'butterfly',
            iconOpacity: 0.2,
            headingSize: 34,
            bodySize: 16
        },
    },
    {
        id: 'dino-tracks',
        name: 'Dino Tracks',
        fonts: { heading: 'Architects Daughter', body: 'Andika', tracing: 'Codystar' },
        colors: {
            background: '#f7fee7',
            heading: '#3f6212',
            storyText: '#4d7c0f',
            tracing: '#bef264',
            writingLine: '#ecfccb',
            border: '#84cc16',
            accent: '#a3e635',
            pageNumber: '#3f6212',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 12,
            showIcon: true,
            iconSet: 'dinosaur',
            iconOpacity: 0.18,
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'sweet-treats',
        name: 'Sweet Treats',
        fonts: { heading: 'Indie Flower', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#fff1f2',
            heading: '#881337',
            storyText: '#9f1239',
            tracing: '#fecdd3',
            writingLine: '#ffe4e6',
            border: '#fb7185',
            accent: '#fda4af',
            pageNumber: '#881337',
        },
        layout: {
            borderStyle: 'dashed',
            cornerRadius: 40,
            showIcon: true,
            iconSet: 'candy',
            iconOpacity: 0.2,
            headingSize: 36,
            bodySize: 17
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
