import type { Template } from '../types';

export const dottedFrameTemplate: Template = {
    id: 'dotted-frame-premium',
    name: '11 — Dotted Frame Classic',
    description: 'Elegant layout within a dotted boundary',
    layout: 'words-on-top',
    background: { color: '#ffffff' },
    contentBox: {
        border: { width: 1.2, color: '#555555', style: 'dotted', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.2, color: '#999999', style: 'solid', radius: 0 }, padding: 2 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 5 },
    typography: {
        title: { fontFamily: 'Playfair Display', fontSize: 26, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        description: { fontFamily: 'Lato', fontSize: 12, color: '#444444', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 14, color: '#000000', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Lato', fontSize: 16, color: '#000000', lineHeight: 1.2, alignment: 'center' },
        wordListItems: { fontFamily: 'Lato', fontSize: 12, color: '#000000', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'elegant-dash',
        margin: 10,
        textStyle: { fontFamily: 'Lato', fontSize: 10, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
