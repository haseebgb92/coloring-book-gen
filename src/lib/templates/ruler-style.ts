import type { Template } from '../types';

export const rulerStyleTemplate: Template = {
    id: 'ruler-style-premium',
    name: '15 — Ruler Style Columned',
    description: 'Technical look with ruler markers',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.6, color: '#1a1a1a', style: 'solid', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0.2, color: '#1a1a1a', style: 'solid', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Roboto Slab', fontSize: 26, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Roboto Mono', fontSize: 11, color: '#555555', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Courier Prime', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Roboto Slab', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Roboto Mono', fontSize: 11, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 10,
        textStyle: { fontFamily: 'Roboto Mono', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
