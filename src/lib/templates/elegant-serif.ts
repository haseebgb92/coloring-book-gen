import type { Template } from '../types';

export const elegantSerifTemplate: Template = {
    id: 'elegant-serif-premium',
    name: '07 — Elegant Serif',
    description: 'Classic grayscale book aesthetic',
    layout: 'puzzle-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0.2, color: '#333333', style: 'solid', radius: 0 },
        padding: 15,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.5, color: '#333333', style: 'solid', radius: 0 }, padding: 0 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Merriweather', fontSize: 26, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'PT Serif', fontSize: 12, color: '#333333', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'PT Serif', fontSize: 18, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'PT Serif', fontSize: 12, color: '#333333', lineHeight: 1.6, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'accent-bar',
        margin: 12,
        textStyle: { fontFamily: 'PT Serif', fontSize: 11, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
