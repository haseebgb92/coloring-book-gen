
import type { Template } from '../types';

export const minimalistLuxuryTemplate: Template = {
    id: 'minimalist-luxury',
    name: '22 — Minimalist Luxury',
    description: 'High-end fashion editorial look with thin lines and elegant spacing',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 40,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.2, color: '#000000', style: 'solid', radius: 0 }, padding: 10 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Playfair Display', fontSize: 32, color: '#111111', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Montserrat', fontSize: 10, color: '#666666', lineHeight: 1.6, alignment: 'center' },
        gridLetters: { fontFamily: 'Montserrat', fontSize: 12, color: '#111111', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Playfair Display', fontSize: 14, color: '#111111', lineHeight: 2, alignment: 'center' },
        wordListItems: { fontFamily: 'Montserrat', fontSize: 10, color: '#333333', lineHeight: 1.8, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'elegant-dash',
        margin: 20,
        textStyle: { fontFamily: 'Playfair Display', fontSize: 9, color: '#444444', lineHeight: 1, alignment: 'center' },
    },
};
