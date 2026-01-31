import type { Template } from '../types';

export const dashedBoxTemplate: Template = {
    id: 'dashed-box-premium',
    name: '12 — Dashed Box Modular',
    description: 'Technical wireframe aesthetic',
    layout: 'puzzle-on-top',
    background: { color: '#f9fafb' },
    contentBox: {
        border: { width: 0.5, color: '#d1d5db', style: 'solid', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.8, color: '#4b5563', style: 'dashed', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0.8, color: '#4b5563', style: 'dashed', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Montserrat', fontSize: 24, color: '#111827', lineHeight: 1.2, alignment: 'left' },
        description: { fontFamily: 'Inter', fontSize: 11, color: '#6b7280', lineHeight: 1.4, alignment: 'left' },
        gridLetters: { fontFamily: 'Inconsolata', fontSize: 13, color: '#111827', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Inter', fontSize: 14, color: '#111827', lineHeight: 1.2, alignment: 'left' },
        wordListItems: { fontFamily: 'Inter', fontSize: 11, color: '#4b5563', lineHeight: 1.6, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 10,
        textStyle: { fontFamily: 'Inter', fontSize: 9, color: '#9ca3af', lineHeight: 1, alignment: 'center' },
    },
};
