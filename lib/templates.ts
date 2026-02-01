import { TemplateConfig } from './types';

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        fonts: { heading: 'Inter', body: 'Inter', tracing: 'Inter' }, // Placeholder fonts
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
        layout: { borderStyle: 'solid', cornerRadius: 0, showIcon: false },
    },
    {
        id: 'bedtime-cozy',
        name: 'Bedtime Cozy',
        fonts: { heading: 'Comfortaa', body: 'Open Sans', tracing: 'Outfit' },
        colors: {
            background: '#fffbf0', // Warm cream
            heading: '#4a3b52',
            storyText: '#5d5463',
            tracing: '#a39ba8',
            writingLine: '#e0d8e6',
            border: '#8e8196',
            accent: '#8e8196',
            pageNumber: '#8e8196',
        },
        layout: { borderStyle: 'none', cornerRadius: 16, showIcon: true },
    },
    {
        id: 'jungle-adventure',
        name: 'Jungle Adventure',
        fonts: { heading: 'Chewy', body: 'Nunito', tracing: 'Nunito' },
        colors: {
            background: '#f0fdf4',
            heading: '#166534',
            storyText: '#15803d',
            tracing: '#86efac',
            writingLine: '#bbf7d0',
            border: '#22c55e',
            accent: '#16a34a',
            pageNumber: '#15803d',
        },
        layout: { borderStyle: 'fancy', cornerRadius: 12, showIcon: true },
    },
    {
        id: 'ocean-friends',
        name: 'Ocean Friends',
        fonts: { heading: 'Bubblegum Sans', body: 'Quicksand', tracing: 'Quicksand' },
        colors: {
            background: '#f0f9ff',
            heading: '#0369a1',
            storyText: '#0c4a6e',
            tracing: '#7dd3fc',
            writingLine: '#bae6fd',
            border: '#0ea5e9',
            accent: '#0284c7',
            pageNumber: '#0369a1',
        },
        layout: { borderStyle: 'double', cornerRadius: 24, showIcon: true },
    },
    {
        id: 'fairy-tale',
        name: 'Fairy Tale',
        fonts: { heading: 'Cinzel Decorative', body: 'Lora', tracing: 'Lora' },
        colors: {
            background: '#fff1f2',
            heading: '#be123c',
            storyText: '#4c0519',
            tracing: '#fda4af',
            writingLine: '#fecdd3',
            border: '#e11d48',
            accent: '#e11d48',
            pageNumber: '#9f1239',
        },
        layout: { borderStyle: 'fancy', cornerRadius: 8, showIcon: true },
    },
    {
        id: 'space-explorer',
        name: 'Space Explorer',
        fonts: { heading: 'Orbitron', body: 'Exo 2', tracing: 'Exo 2' },
        colors: {
            background: '#0f172a',
            heading: '#fcd34d',
            storyText: '#e2e8f0',
            tracing: '#475569',
            writingLine: '#334155',
            border: '#3b82f6',
            accent: '#60a5fa',
            pageNumber: '#94a3b8',
        },
        layout: { borderStyle: 'dashed', cornerRadius: 4, showIcon: true },
    },
    {
        id: 'rainbow-playroom',
        name: 'Rainbow Playroom',
        fonts: { heading: 'Fredoka One', body: 'Varela Round', tracing: 'Varela Round' },
        colors: {
            background: '#ffffff',
            heading: '#ec4899',
            storyText: '#374151',
            tracing: '#d1d5db',
            writingLine: '#f3f4f6',
            border: '#8b5cf6',
            accent: '#f59e0b',
            pageNumber: '#6b7280',
        },
        layout: { borderStyle: 'solid', cornerRadius: 20, showIcon: true },
    },
    {
        id: 'calm-neutral',
        name: 'Calm Neutral',
        fonts: { heading: 'Playfair Display', body: 'Lato', tracing: 'Lato' },
        colors: {
            background: '#f5f5f4',
            heading: '#44403c',
            storyText: '#57534e',
            tracing: '#a8a29e',
            writingLine: '#e7e5e4',
            border: '#78716c',
            accent: '#a8a29e',
            pageNumber: '#78716c',
        },
        layout: { borderStyle: 'solid', cornerRadius: 0, showIcon: false },
    },
];

export const INITIAL_PROJECT_STATE: any = { // Partial state for init
    printSettings: {
        trimSize: '8.5x11',
        bleed: false, // Default off as per spec recommended to turn on if borders
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
        spacingScale: 1.0
    }
};
