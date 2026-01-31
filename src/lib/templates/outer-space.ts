
import type { Template } from '../types';

export const outerSpaceTemplate: Template = {
    id: 'outer-space-explorer',
    name: '39 — Outer Space Explorer',
    description: 'Dark, galactic layout with deep purple accents and neon tech fonts',
    layout: 'puzzle-on-top',
    background: { color: '#03001C' },
    contentBox: {
        border: { width: 0.5, color: '#B6E2A1', style: 'solid', radius: 12 },
        padding: 20,
        fillColor: '#0A001F',
    },
    gridBox: { border: { width: 1, color: '#FE6244', style: 'solid', radius: 4 }, padding: 8, fillColor: '#1A0033' },
    wordBox: { border: { width: 0.4, color: '#B6FFFA', style: 'dashed', radius: 2 }, padding: 10, fillColor: '#0C0C2D' },
    typography: {
        title: { fontFamily: 'Audiowide', fontSize: 30, color: '#FE6244', lineHeight: 1.1, alignment: 'center' },
        description: { fontFamily: 'Space Grotesk', fontSize: 11, color: '#B6E2A1', lineHeight: 1.4, alignment: 'center' },
        gridLetters: { fontFamily: 'Roboto Mono', fontSize: 13, color: '#FFFFFF', lineHeight: 1, alignment: 'center' },
        wordListHeading: { fontFamily: 'Audiowide', fontSize: 14, color: '#B6FFFA', lineHeight: 1.5, alignment: 'center' },
        wordListItems: { fontFamily: 'Space Grotesk', fontSize: 11, color: '#FFFFFF', lineHeight: 1.5, alignment: 'center' },
    },
    pageNumber: {
        position: 'bottom-center',
        style: 'modern-box',
        margin: 15,
        fillColor: '#FE6244',
        textStyle: { fontFamily: 'Audiowide', fontSize: 9, color: '#000000', lineHeight: 1, alignment: 'center' },
    },
};
