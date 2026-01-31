import type { Template } from '../types';

export const vintageRetroTemplate: Template = {
    id: 'vintage-retro-premium',
    name: '01 — Vintage Retro',
    description: 'Traditional grayscale with retro serif title',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1.5, color: '#333333', style: 'solid', radius: 8 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.3, color: '#333333', style: 'solid', radius: 0 }, padding: 3 },
    wordBox: { border: { width: 0, color: '#333333', style: 'none', radius: 0 }, padding: 4 },
    typography: {
        title: { fontFamily: 'Playfair Display', fontSize: 26, color: '#1a1a1a', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Lato', fontSize: 12, color: '#666666', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 12, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Playfair Display', fontSize: 18, color: '#1a1a1a', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Lato', fontSize: 12, color: '#333333', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'elegant-dash',
        margin: 10,
        textStyle: { fontFamily: 'Playfair Display', fontSize: 10, color: '#333333', lineHeight: 1, alignment: 'center' },
    },
};
