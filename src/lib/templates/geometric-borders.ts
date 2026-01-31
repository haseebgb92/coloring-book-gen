import type { Template } from '../types';

export const geometricBordersTemplate: Template = {
    id: 'geometric-borders-premium',
    name: '09 — Geometric Borders',
    description: 'Structured layout with geometric accents',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 2, color: '#333333', style: 'dotted', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 1, color: '#333333', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 1.5, color: '#333333', style: 'solid', radius: 0 }, padding: 6 },
    typography: {
        title: { fontFamily: 'Lato', fontSize: 24, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Lato', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Fira Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lato', fontSize: 15, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Lato', fontSize: 11, color: '#333333', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'circle',
        margin: 12,
        textStyle: { fontFamily: 'Lato', fontSize: 10, color: '#333333', lineHeight: 1, alignment: 'center' },
    },
};
