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
        id: 'bedtime-cozy',
        name: 'Bedtime Cozy',
        fonts: { heading: 'Fredoka', body: 'Nunito', tracing: 'Codystar' },
        colors: {
            background: '#fffcf2',
            heading: '#432818',
            storyText: '#99582a',
            tracing: '#bb9457',
            writingLine: '#ffe6a7',
            border: '#6f4e37',
            accent: '#bb9457',
            pageNumber: '#99582a',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'stars',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'playful-kids',
        name: 'Playful Kids',
        fonts: { heading: 'Fredoka', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#fffef0',
            heading: '#0ea5e9',
            storyText: '#334155',
            tracing: '#94a3b8',
            writingLine: '#e2e8f0',
            border: '#0ea5e9',
            accent: '#38bdf8',
            pageNumber: '#64748b',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'stars',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'enchanted-forest',
        name: 'Enchanted Forest',
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
    {
        id: 'solar-system',
        name: 'Solar System',
        fonts: { heading: 'Orbitron', body: 'Exo 2', tracing: 'Codystar' },
        colors: {
            background: '#0f172a',
            heading: '#38bdf8',
            storyText: '#94a3b8',
            tracing: '#334155',
            writingLine: '#1e293b',
            border: '#38bdf8',
            accent: '#7dd3fc',
            pageNumber: '#475569',
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
        id: 'sweet-dreams',
        name: 'Sweet Dreams',
        fonts: { heading: 'Comic Neue', body: 'Quicksand', tracing: 'Codystar' },
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
        id: 'ancient-egypt',
        name: 'Ancient Egypt',
        fonts: { heading: 'Cinzel Decorative', body: 'Lora', tracing: 'Codystar' },
        colors: {
            background: '#fef3c7',
            heading: '#92400e',
            storyText: '#78350f',
            tracing: '#fde68a',
            writingLine: '#fef3c7',
            border: '#92400e',
            accent: '#d97706',
            pageNumber: '#b45309',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 4,
            showIcon: true,
            iconSet: 'geometric',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'dino-discovery',
        name: 'Dino Discovery',
        fonts: { heading: 'Fredoka', body: 'Varela Round', tracing: 'Codystar' },
        colors: {
            background: '#ecfdf5',
            heading: '#065f46',
            storyText: '#064e3b',
            tracing: '#a7f3d0',
            writingLine: '#d1fae5',
            border: '#059669',
            accent: '#10b981',
            pageNumber: '#047857',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 35,
            bodySize: 15
        },
    },
    {
        id: 'jungle-safari',
        name: 'Jungle Safari',
        fonts: { heading: 'Indie Flower', body: 'Andika', tracing: 'Codystar' },
        colors: {
            background: '#f7fee7',
            heading: '#3f6212',
            storyText: '#365314',
            tracing: '#bef264',
            writingLine: '#ecfccb',
            border: '#4d7c0f',
            accent: '#65a30d',
            pageNumber: '#3f6212',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 15,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 36,
            bodySize: 17
        },
    },
    {
        id: 'future-city',
        name: 'Future City',
        fonts: { heading: 'Orbitron', body: 'Exo 2', tracing: 'Codystar' },
        colors: {
            background: '#020617',
            heading: '#22d3ee',
            storyText: '#94a3b8',
            tracing: '#1e293b',
            writingLine: '#0f172a',
            border: '#22d3ee',
            accent: '#06b6d4',
            pageNumber: '#64748b',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 4,
            showIcon: true,
            iconSet: 'geometric',
            headingSize: 32,
            bodySize: 14
        },
    },
    {
        id: 'ocean-deep',
        name: 'Ocean Deep',
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
            iconSet: 'geometric',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'unicorn-magic',
        name: 'Unicorn Magic',
        fonts: { heading: 'Bubblegum Sans', body: 'Quicksand', tracing: 'Codystar' },
        colors: {
            background: '#fdf4ff',
            heading: '#c026d3',
            storyText: '#86198f',
            tracing: '#f5d0fe',
            writingLine: '#fae8ff',
            border: '#d946ef',
            accent: '#e879f9',
            pageNumber: '#a21caf',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'hearts',
            headingSize: 38,
            bodySize: 18
        },
    },
    {
        id: 'mountain-haven',
        name: 'Mountain Haven',
        fonts: { heading: 'Lora', body: 'Lato', tracing: 'Codystar' },
        colors: {
            background: '#fafaf9',
            heading: '#44403c',
            storyText: '#57534e',
            tracing: '#d6d3d1',
            writingLine: '#f5f5f4',
            border: '#78716c',
            accent: '#a8a29e',
            pageNumber: '#57534e',
        },
        layout: {
            borderStyle: 'solid',
            cornerRadius: 8,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 30,
            bodySize: 15
        },
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
