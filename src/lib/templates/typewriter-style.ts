import type { Template } from '../types';

export const typewriterStyleTemplate: Template = {
    id: 'typewriter-style-premium',
    name: '08 — Typewriter Style',
    description: 'Vintage manuscript with courier fonts',
    layout: 'words-on-top',
    background: { color: '#f5f5f5' },
    contentBox: {
        border: { width: 0, color: 'transparent', style: 'none', radius: 0 },
        padding: 12,
        fillColor: '#ffffff',
    },
    gridBox: { border: { width: 0.4, color: '#666666', style: 'solid', radius: 0 }, padding: 4 },
    wordBox: { border: { width: 0, color: 'transparent', style: 'none', radius: 0 }, padding: 0 },
    typography: {
        title: { fontFamily: 'Montserrat', fontSize: 22, color: '#111111', lineHeight: 1.2, alignment: 'left' },
        description: { fontFamily: 'Source Code Pro', fontSize: 11, color: '#333333', lineHeight: 1.2, alignment: 'left' },
        gridLetters: { fontFamily: 'Source Code Pro', fontSize: 11, color: '#111111', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Source Code Pro', fontSize: 14, color: '#111111', lineHeight: 1.2, alignment: 'left' },
        wordListItems: { fontFamily: 'Source Code Pro', fontSize: 11, color: '#333333', lineHeight: 1.4, alignment: 'left' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'simple',
        margin: 10,
        textStyle: { fontFamily: 'Source Code Pro', fontSize: 10, color: '#444444', lineHeight: 1, alignment: 'center' },
    },
};
