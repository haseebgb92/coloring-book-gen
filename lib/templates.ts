import { TemplateConfig } from './types';

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        fonts: { heading: 'Outfit', body: 'Inter', tracing: 'Outfit' },
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
            cornerRadius: 0,
            showIcon: false,
            headingSize: 28,
            bodySize: 14
        },
    },
    {
        id: 'bedtime-cozy',
        name: 'Bedtime Cozy',
        fonts: { heading: 'Fredoka', body: 'Nunito', tracing: 'Nunito' },
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
            borderStyle: 'none',
            cornerRadius: 24,
            showIcon: true,
            iconSet: 'hearts',
            headingSize: 32,
            bodySize: 16
        },
    },
    {
        id: 'jungle-adventure',
        name: 'Jungle Adventure',
        fonts: { heading: 'Gaegu', body: 'Andika', tracing: 'Andika' },
        colors: {
            background: '#f7fee7',
            heading: '#365314',
            storyText: '#4d7c0f',
            tracing: '#a3e635',
            writingLine: '#d9f99d',
            border: '#65a30d',
            accent: '#84cc16',
            pageNumber: '#365314',
        },
        layout: {
            borderStyle: 'fancy',
            cornerRadius: 16,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 36,
            bodySize: 15
        },
    },
    {
        id: 'ocean-friends',
        name: 'Ocean Friends',
        fonts: { heading: 'Comfortaa', body: 'Quicksand', tracing: 'Quicksand' },
        colors: {
            background: '#f0f9ff',
            heading: '#075985',
            storyText: '#0369a1',
            tracing: '#7dd3fc',
            writingLine: '#e0f2fe',
            border: '#0ea5e9',
            accent: '#38bdf8',
            pageNumber: '#0369a1',
        },
        layout: {
            borderStyle: 'double',
            cornerRadius: 40,
            showIcon: true,
            iconSet: 'geometric',
            headingSize: 30,
            bodySize: 15
        },
    },
    {
        id: 'enchanted-forest',
        name: 'Enchanted Forest',
        fonts: { heading: 'Architects Daughter', body: 'Indie Flower', tracing: 'Indie Flower' },
        colors: {
            background: '#fafaf9',
            heading: '#44403c',
            storyText: '#57534e',
            tracing: '#a8a29e',
            writingLine: '#e7e5e4',
            border: '#78716c',
            accent: '#d6d3d1',
            pageNumber: '#57534e',
        },
        layout: {
            borderStyle: 'fancy',
            cornerRadius: 8,
            showIcon: true,
            iconSet: 'leaves',
            headingSize: 34,
            bodySize: 17
        },
    },
    {
        id: 'solar-system',
        name: 'Solar System',
        fonts: { heading: 'Fredoka', body: 'Outfit', tracing: 'Outfit' },
        colors: {
            background: '#0f172a',
            heading: '#fde047',
            storyText: '#f8fafc',
            tracing: '#94a3b8',
            writingLine: '#334155',
            border: '#fef08a',
            accent: '#fbbf24',
            pageNumber: '#e2e8f0',
        },
        layout: {
            borderStyle: 'dashed',
            cornerRadius: 4,
            showIcon: true,
            iconSet: 'stars',
            headingSize: 32,
            bodySize: 15
        },
    },
    {
        id: 'sweet-dreams',
        name: 'Sweet Dreams',
        fonts: { heading: 'Comic Neue', body: 'Quicksand', tracing: 'Quicksand' },
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
            borderStyle: 'none',
            cornerRadius: 32,
            showIcon: true,
            iconSet: 'hearts',
            headingSize: 38,
            bodySize: 18
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
