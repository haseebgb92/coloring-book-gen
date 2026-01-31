
import type { Template } from '../types';

export const regalGoldenNavyTemplate: Template = {
    id: 'regal-golden-navy',
    name: '43 — Regal Golden Navy',
    description: 'High-end luxury layout with deep navy tones and elegant gold accents',
    layout: 'puzzle-on-top',
    background: { color: '#001C30' },
    contentBox: {
        border: { width: 4, color: '#D4AF37', style: 'solid', radius: 4 },
        padding: 24,
        fillColor: '#FFFFFF',
    },
    gridBox: { border: { width: 0.5, color: '#001C30', style: 'solid', radius: 0 }, padding: 6, fillColor: '#F9F9F9' },
    wordBox: { border: { width: 1, color: '#D4AF37', style: 'solid', radius: 0 }, padding: 14, fillColor: '#FBF8EF' },
    typography: {
        title: { fontFamily: 'Cinzel Decorative', fontSize: 32, color: '#001C30', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Playfair Display', fontSize: 13, color: '#666666', lineHeight: 1.5, alignment: 'center' },
        gridLetters: { fontFamily: 'Cinzel', fontSize: 13, color: '#001C30', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Cinzel', fontSize: 16, color: '#D4AF37', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Playfair Display', fontSize: 12, color: '#001C30', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'elegant-dash',
        margin: 18,
        textStyle: { fontFamily: 'Cinzel', fontSize: 11, color: '#D4AF37', lineHeight: 1, alignment: 'center' },
    },
};
